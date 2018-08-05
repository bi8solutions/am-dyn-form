import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ObservableDS} from "../modules/am-dyn-form/dyn-datasource";
import {tap} from "rxjs/operators";
import {of} from "rxjs/internal/observable/of";
import {Observable} from "rxjs/Observable";

export enum AppKeys {
  findUserPosts,
  findPostComments,
  findAllAvengers
}

@Injectable({providedIn: 'root'})
export class AppService {
  constructor(private http: HttpClient){
  }

  findUserPosts(userId: number) : Observable<any> {
    //console.log("============> findUserPosts: ", userId);
    return this.http.get(`https://jsonplaceholder.typicode.com/users/${userId}/posts`);
  }

  searchUserPosts(userId: number) : Observable<any> {
    console.log(`============> searchUserPosts: ${userId}`, userId);
    return this.http.get(`https://jsonplaceholder.typicode.com/users/${userId}/posts`);
  }

  findPostComments(postId: number) : Observable<any> {
    return this.http.get(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`)
    //return this.http.get(`https://jsonplaceholder.typicode.com/users`)
  }

  loadPost(postId) : Observable<any> {
    return this.http.get(`https://jsonplaceholder.typicode.com/posts/${postId}`);
  }

  findAllAvengers() : Observable<any> {
    console.log("finding...");
    return of(avengers);
  }

  asODS() : ObservableDS {
    let ods = new ObservableDS();
    ods.addObservable(AppKeys.findUserPosts, (id)=>this.findUserPosts(id), {behave: false});
    ods.addObservable(AppKeys.findPostComments, (id)=>this.findPostComments(id));
    ods.addObservable(AppKeys.findAllAvengers, ()=>this.findAllAvengers());
    return ods;
  }
}

export interface Avenger {
  slug: string,
  name: string,
  surname: string,
  email: string
}

export let avengers = [
  {
    id: 1,
    slug: 'Spiderman',
    name: 'Peter',
    surname: 'Parker',
    email: 'peter.parker@avengers.com'
  },
  {
    id: 2,
    slug: 'Ironman',
    name: 'Tony',
    surname: 'Stark',
    email: 'tony.stark@avengers.com'
  },
  {
    id: 3,
    slug: 'Hulk',
    name: 'Bruce',
    surname: 'Banner',
    email: 'bruce.banner@avengers.com'
  },
  {
    id: 4,
    slug: 'Captain America',
    name: 'Steve',
    surname: 'Rogers',
    email: 'steve.rogers@avengers.com'
  },
  {
    id: 5,
    slug: 'Batman',
    name: 'Bruce',
    surname: 'Wayne',
    email: 'bruce.wayne@avengers.com'
  },
  {
    id: 6,
    slug: 'Superman',
    name: 'Clark',
    surname: 'Kent',
    email: 'clar.kent@avengers.com'
  }
];
