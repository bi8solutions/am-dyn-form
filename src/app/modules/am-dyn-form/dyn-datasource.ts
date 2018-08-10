import {Subject} from "rxjs/Subject";

import {Observable, ReplaySubject, Subscription} from 'rxjs';
import {filter, map, takeWhile, tap} from 'rxjs/operators';
import {OperatorFunction} from "rxjs/interfaces";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {of} from "rxjs/internal/observable/of";

export interface ObservableFn<A, T> {
  (param?: A): Observable<T>;
}

export enum NotificationType {
  init = 'init',
  busy = 'busy',
  idle = 'idle',
  paramFunc = 'paramFunc',
  inputNext = 'inputNext',
  inputComplete = 'inputComplete',
  inputError = 'inputError',
  outputFuncError = 'outputFuncError',
  outputNext = 'outputNext',
  outputError = 'outputError',
  outputComplete = 'outputComplete',
  close = 'close',
  enable = 'enable',
  disable = 'disable'
}

export interface ChannelNotification {
  type: NotificationType,
  name?: string,
  data?: any,
  error?: any,
}

export interface NotificationFn {
  (input: ChannelNotification)
}

export interface ParameterFn<A, T> {
  (input: A) : T
}

export class Channel<A extends any, T extends any> {
  private closed: boolean = false;
  private input: Subject<A>;
  private output: Subject<T>;
  private enabled: boolean = true;
  private inputBusy: boolean;
  private outputBusy: boolean;
  private name: string;
  private notifications;
  private debug: boolean;
  private paramFn: ParameterFn<any, any>;
  private notificationFn: NotificationFn;

  constructor(private fn: ObservableFn<A, T>, options?: {
    input?: Subject<A>,
    output?: Subject<T>,
    enabled?: boolean,
    name?: string,
    debug?: boolean,
    paramFn?: ParameterFn<any, any>,
    notificationFn?: NotificationFn
  }){
    if (options){
      this.input = options.input || new Subject<A>();
      this.output = options.output || new ReplaySubject<T>(1);
      this.enabled = options.enabled || true;
      this.name = options.name || 'channel';
      this.debug = options.debug || false;
      this.paramFn = options.paramFn;
      this.notificationFn = options.notificationFn;

    } else {
      this.input = new Subject<A>();
      this.output = new ReplaySubject<T>(1);
      this.enabled = true;
      this.name = 'channel';
      this.debug = false;
    }

    this.notifications = new BehaviorSubject<ChannelNotification>({type: NotificationType.init});
    //this.observeNotifications().subscribe();

    if (this.notificationFn){
      this.observeNotifications().subscribe(this.notificationFn);
    }

    this.input.pipe(
      takeWhile((value: A)=>!this.closed),
      filter((value: A)=>this.enabled),
      map((input)=>{
        this.emitNotification({ type: NotificationType.busy});
        if (this.paramFn) {
          let result =  this.paramFn(input);
          this.emitNotification({ type: NotificationType.paramFunc, data: {before: input, after: result}});
          return result;
        } else {
          return input;
        }
      }),
      tap((data)=>{
        this.inputBusy = true;
        this.emitNotification({ type: NotificationType.inputNext, data: data});
      })
    ).subscribe({
      next: (value: A)=>{
        try {
          this.outputBusy = true;
          let observable = this.fn(value);
          
          observable.pipe(tap((data)=>{
            this.emitNotification({type: NotificationType.outputNext, data: data});

          })).subscribe({
            next: (response) =>this.output.next(response),
            error: (err) =>{
              this.emitNotification({ type: NotificationType.outputError, error: err});
              this.output.error(err);
            },
            complete: ()=> {
              this.outputBusy = false;
              this.emitNotification({ type: NotificationType.outputComplete});
              this.emitNotification({ type: NotificationType.idle});
            }
          });
        } catch (err){
          this.emitNotification({ type: NotificationType.outputFuncError, error: err});
          this.outputBusy = false;
        }
      },
      error: (err: any)=> {
        this.emitNotification({ type: NotificationType.outputFuncError, error: err});
      },
      complete: ()=> {
        this.inputBusy = false
      }
    });
  }

  isBusy(){
    return this.inputBusy || this.outputBusy;
  }

  isInputBusy(){
    return this.inputBusy;
  }

  isOutputBusy(){
    return this.outputBusy;
  }

  next(value?: A) : Channel<A, T> {
    this.input.next(value);
    return this;
  }

  emit(value: T){
    this.output.next(value);
  }

  observe(value?: A, ...ops: OperatorFunction<any, any>[]) : Observable<T>{
    setInterval(()=>{
      this.next(value);
    });
    return this.output.pipe(...ops);
  }

  link(observer: Observable<A>, ...ops: OperatorFunction<any, any>[]){
    observer.pipe(...ops).subscribe((value: A)=>this.next(value));
  }

  pipe(observer: Observable<T>, ...ops: OperatorFunction<any, any>[]){
    observer.pipe(...ops).subscribe((value: T)=>this.emit(value));
  }

  asObservable() : Observable<T>{
    return this.output.asObservable();
  }

  observeNotifications() : Observable<ChannelNotification>{
    return this.notifications.asObservable();
  }

  protected emitNotification(notification: ChannelNotification){
    notification.name = this.name;
    if (this.debug) {
      switch (notification.type) {
        case NotificationType.inputError:
        case NotificationType.outputError:
        case NotificationType.outputFuncError:
          console.error(`[${notification.name}:${notification.type}] `, notification.error || '');
          break;
        default:
          console.debug(`[${notification.name}:${notification.type}] `, notification.data || '');
          break;
      }
    }
    this.notifications.next(notification);
  }

  enable() : Channel<A, T> {
    this.enabled = false;
    return this;
  }

  disable() : Channel<A, T> {
    this.enabled = true;
    return this;
  }

  close(){
    this.closed = true;
    this.input.unsubscribe();
    this.output.unsubscribe();
  }
}

export class ChannelSwitch {
  private channels = new Map<any, Channel<any, any>>();

  constructor(...channels : {key: any, channel: Channel<any,any>}[]){
    channels.forEach((config)=>{
      this.channels.set(config.key, config.channel);
    })
  }

  set(key: any, channel: Channel<any, any>) : Channel<any, any>{
    this.channels.set(key, channel);
    return channel;
  }

  get(key: any) : Channel<any, any> {
    return this.channels.get(key);
  }

  isBusy(key: any) : boolean {
    let channel = this.channels.get(key);
    return channel ? channel.isBusy() : false;
  }

  isInputBusy(key: any){
    let channel = this.channels.get(key);
    return channel ? channel.isInputBusy() : false;
  }

  isOutputBusy(key: any){
    let channel = this.channels.get(key);
    return channel ? channel.isOutputBusy() : false;
  }

  next(key: any, value?: any) : Channel<any, any> {
    let channel = this.channels.get(key);
    return channel ? channel.next(value) : null;
  }

  emit(key: any, value: any){
    let channel = this.channels.get(key);
    return channel ? channel.emit(value) : false;
  }

  observe(key: any, value?: any, ...ops: OperatorFunction<any, any>[]) : Observable<any>{
    let channel = this.channels.get(key);
    return channel ? channel.observe(value, ...ops) : null;
  }

  link(key: any, observer: Observable<any>, ...ops: OperatorFunction<any, any>[]){
    let channel = this.channels.get(key);
    if (channel) channel.link(observer, ...ops);
  }

  pipe(key: any, observer: Observable<any>, ...ops: OperatorFunction<any, any>[]){
    let channel = this.channels.get(key);
    if (channel) channel.pipe(observer, ...ops);
  }

  asObservable(key: any) : Observable<any> {
    let channel = this.channels.get(key);
    return channel ? channel.asObservable() : null;
  }

  observeNotifications(key: any) : Observable<ChannelNotification> {
    let channel = this.channels.get(key);
    return channel ? channel.observeNotifications() : null;
  }

  enable(key: any) : Channel<any, any> {
    let channel = this.channels.get(key);
    return channel ? channel.enable() : null;
  }

  disable(key: any)  : Channel<any, any> {
    let channel = this.channels.get(key);
    return channel ? channel.disable() : null;
  }

  close(key: any) {
    let channel = this.channels.get(key);
    return channel ? channel.close() : null;
  }
}

export interface DSObservableFn {
  (value?: any): Observable<any>;
}

export interface DSOperator {
  operator: OperatorFunction<any, any>,
  id: any
}

export interface IObserveOptions {
  behave: boolean;
}

export interface DSInputOptions {
}

export interface DSOutputOptions {
  behave: boolean;
}

export interface DSInputEvent {
  id: any;
  options?: DSInputOptions,
  value?: any
}

export interface DSEvent {
  input: DSInputEvent,
  output: any;
}

export class DSPipe {

  private sub: Subscription;
  constructor(private ds: IObservableDS,
              private key: any,
              private obs: Observable<any>,
              private ops: OperatorFunction<any, any>[],
              private enabled: boolean = true){
    this.connect();
  }

  isConnected() : boolean {
    return !(!this.sub);
  }

  connect(){
    if (this.isConnected()) return;

    this.sub = this.obs.pipe(...this.ops).subscribe((value)=>{
      console.log(`----> pipe (${this.key})`, value);
      this.ds.next(this.key, value);
    })
  }

  disconnect(){
    if (!this.isConnected()) return;
    this.sub.unsubscribe();
  }

  setOperators(...ops: OperatorFunction<any, any>[]){
    this.disconnect();
    this.ops = ops;
    this.connect();
  }

  enable(){
    this.enabled = true;
  }

  disable(){
    this.enabled = false;
  }
}

export interface IObservableDS  {
  connect() : void;
  isConnected() : boolean;
  addObservable(key: any, os: DSObservableFn | Observable<any>, options?: IObserveOptions) : void;
  next(key: any, value: any, options?: DSInputOptions) : void;
  observe(key: any, value?: any, options?: DSOutputOptions) : Observable<any>;
  disconnect() : void;
  //setOperators(operators: DSOperator[], key?: any) : void;
  //clearOperators(...id) : void;
  //clearAllOperators() : void;
  addPipe(obs: Observable<any>, key: any, ...operators: OperatorFunction<any, any>[]): DSPipe;
  asObservable() : Observable<any>;
  destroy();
  clearPipes(...pipes: DSPipe[]);
  clearAllPipes();
  getPipes() : DSPipe[];
  //clone() : IObservableDS;
}

export class ObservableDS implements IObservableDS {
  private connected = false;
  private fnMap = new Map<any, DSObservableFn>();
  private subjectMap = new Map<any, Subject<any>>();
  private input$ = new Subject<DSInputEvent>();
  private inputSub: Subscription = null;
  private events$ = new Subject<DSEvent>();
  private pipes: DSPipe[] = [];

  constructor(options?: {
    autoconnect?: boolean;
    key?: any;
    obs?: DSObservableFn | Observable<any>;
  }){
    if (options){
      if (options.autoconnect) this.connect();
      if (options.key && options.obs){
        this.addObservable(options.key, options.obs);
      }
    } else {
      // we connect by default
      this.connect();
    }
  }

  isConnected() {
    return !(!this.inputSub);
  }

  connect(): void {
    if (this.isConnected()) return;

    this.inputSub = this.input$.pipe(
      filter((input: DSInputEvent)=> {
        if (this.fnMap.has(input.id)) return true;
        console.error(`[obs] observable with id '${input.id}' not found`);
        return false;
      }),
      map((input: DSInputEvent)=> {
        let obsFn = this.fnMap.get(input.id);
        return { event: input, fn: obsFn(input.value), sub: this.subjectMap.get(input.id) }
      }))
      .subscribe((input)=> this.relay(input.event, input.fn, input.sub));
    this.connected = true;
  }

  protected relay(event: DSInputEvent, obs: Observable<any>, subject: Subject<any>){
    //console.log(`-----> relay (${subject}: `, event);
    obs.pipe(
      takeWhile(()=> this.connected),
      //tap((response) => { console.log(`-----> tap relay: `, response); subject.next(response) }),
      tap((response) => this.emit({input: event, output: response}))
    ).subscribe();
  }

  protected emit(event: DSEvent){
    this.events$.next(event);
  }

  asObservable() : Observable<any> {
    return this.events$.asObservable();
  }

  disconnect(): void {
    if (!this.isConnected()) return;
    this.inputSub.unsubscribe();

    let bla = of([1,2,3]);
    let blaf = bla.subscribe();
    blaf.add(blaf);

    let duff = new Subject();
    blaf.add(duff.asObservable().subscribe());
  }

  next(key: any, value: any, options?: DSInputOptions): void {
    if (!this.connected) return;
    let event = {id: key, options: options, value: value};
    //console.log(`-----> next (${event})`, event);
    this.input$.next(event);
  }

  addPipe(obs: Observable<any>, key: any, ...operators: OperatorFunction<any, any>[]): DSPipe {
    let pipe = new DSPipe(this, key, obs, operators);
    this.pipes.push(pipe);
    return pipe;
  }

  clearPipes(...pipes: DSPipe[]){
    pipes.forEach((pipe, index)=>{
      pipe.disconnect();
      pipes = pipes.splice(index, 1);
    });
  }

  clearAllPipes(){
    this.clearPipes(...this.pipes);
  }

  getPipes() : DSPipe[] {
    return this.pipes;
  }

  addObservable(key: any, obs: DSObservableFn | Observable<any>, options?: IObserveOptions): void {
    if (!options) options = { behave: true };
    this.fnMap.set(key, obs instanceof Observable ? ()=> obs : obs);
    this.subjectMap.set(key, options.behave ? new BehaviorSubject<any>([]) : new Subject<any>());
  }

  observe(key: any, value?:any, options?: DSOutputOptions): Observable<any> {
    let subject = this.subjectMap.get(key);
    try {
      return subject.asObservable();
    } finally {
      if (value){
        this.next(key, value);
      }
    }
  }

  destroy(){
  }
}
