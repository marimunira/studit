import { Injectable, EventEmitter } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { NewsItem } from "models/news-item";
import {ProjectItem} from '../components/shared/project-list/project-item/project-item';

@Injectable()
export class DataService {
  private UserId;
  private news: BehaviorSubject<NewsItem[]> = <BehaviorSubject<NewsItem[]>>new BehaviorSubject([]);
  private projects: BehaviorSubject<ProjectItem[]> = <BehaviorSubject<ProjectItem[]>>new BehaviorSubject([]);
  private dataStore: {
    news: NewsItem[];
    projects:ProjectItem[];
  } = { news: [], projects: [], };
  public get News() {
    return this.news.asObservable();
  }
  public get Projects() {
    return this.projects.asObservable();
  }
  // Constructor.
  constructor(private api: ApiService) { }
  // Load data functions.
  loadAll() {

    console.log('Data.service ->loadAll');
    this.loadProjects();
    this.loadNews();
    if (localStorage.getItem('current_user')) {
      this.UserId = JSON.parse(localStorage.getItem('current_user')).id;
      this.loadUsersProjects();
      this.loadEnrolledUsersProject();
    }
  }
  // Load from server functions
  loadProjects() {
    this.api.getProjectItems().subscribe(res => {
      if (res != null) {
        this.dataStore.projects=res;
        this.projects.next(Object.assign({}, this.dataStore).projects);
      }
    });
  }
  loadUsersProjects() {
    if (localStorage.getItem('current_user')) {
      this.api.getProjectsOfUser(this.UserId).subscribe(res => {

      });
    } else {
      console.log('Error in data.service: can not load usersProject without auth');
    }
  }
  loadEnrolledUsersProject() {
    if (localStorage.getItem('current_user')) {

    } else {
      console.log('Error in data.service: can not load enrolledUsersProject without auth');
    }
  }
  loadNews() {
    this.api.getNewsPage().subscribe(res => {
      this.dataStore.news = res;
      this.news.next(Object.assign({}, this.dataStore).news);
    });
  }



}