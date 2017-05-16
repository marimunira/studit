import { Component, OnInit, OnDestroy } from '@angular/core';
import { NewsItem } from 'models/news-item';
import { DataService } from '../../../services/data.service'
import { ApiService } from './../../../services/api.service';

@Component({
  selector: 'app-main-news-page',
  templateUrl: './main-news-page.component.html',
  styleUrls: ['./main-news-page.component.css']
})
export class MainNewsPageComponent implements OnInit {

  private news;
  constructor(private apiService: ApiService, private data: DataService) { }

  ngOnInit() {
    this.getNewsList();
  }

  getNewsList() {
    //this.apiService.getNewsPage().subscribe(res => this.news = res);
    this.news = this.data.News;
  }

}
