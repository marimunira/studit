import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { DataService } from 'services/data.service';
import { ProjectService } from 'services/project.service';
import { StudentService } from 'services/student.service';
import { AlertService } from 'services/alert.service'; 

import { MaterialsItem } from 'models/materials-item';
import { ProjectItem } from 'models/project-item';
import { ProjectNewsItem } from 'models/proj-news-item';
import { TasksItem } from 'models/tasks-item';

type StatusEnroll = "Enrolling" | "InProject" | "Unenrolling";

@Component({
  selector: 'app-student-project-page',
  templateUrl: './student-project-page.component.html',
  styleUrls: ['./student-project-page.component.css']
})
export class StudentProjectPageComponent implements OnInit, OnDestroy {

  private projectObs: BehaviorSubject<ProjectItem> = new BehaviorSubject(new ProjectItem());

  private projectId: number;
  private projectEnrollId: number;
  private authorized = false;
  private isTeacher = false;
  private tasks = [];
  private enrollMessage = 'Please write back soon!';
  private enrollButtonStatus = "Enrolling";
  constructor(private route: ActivatedRoute,
    private http: Http,
    private data: DataService,
    private studentService: StudentService,
    private projectService: ProjectService,
    private alert: AlertService,) { }

  ngOnInit() {
    if (localStorage.getItem('current_user')) { this.authorized = true; }
     this.route.params.subscribe(p => {
        this.projectId = +p['id'];
        this.getProjectInfo();
        this.choseButtonStatus();
      }); 
  }
 
  ngOnDestroy() {
  }

  getProjectInfo() {
    this.data.loadProjectByID(this.projectId);
    this.data.ProjectForViewing.subscribe(res => {
      if (res != null)
        this.projectObs.next(res);
    },
      error => {
        this.alert.alertError(error, 'ERROR: getProjectInfo() -> MissedProject');
      });

  }


  enroll() {
    this.studentService.enrollToProject(this.data.UserId, this.projectId,
      JSON.parse(localStorage.getItem('current_user')).Token, this.enrollMessage)
      .subscribe(res => {
        this.enrollButtonStatus = "Unenrolling";
        this.data.loadEnrolledUsersProject();
      },
      error => {
        this.alert.alertError(error, 'ERROR: enroll() -> enrollToProject()');
      });
  }

  unenroll() {
    this.studentService.unenrollToProject(this.projectEnrollId,
      JSON.parse(localStorage.getItem('current_user')).Token).subscribe(res => {
        this.enrollButtonStatus = "Enrolling";
        this.data.loadEnrolledUsersProject();
      },
      error => {
        this.alert.alertError(error, 'ERROR: unenroll() -> unenrollToProject()');
      });
  }

  choseButtonStatus() {
    this.enrollButtonStatus = "Enrolling";
    this.data.UserProjects.subscribe(res => {
      if (res != null) {
         if (res.find(pr => pr.Id == this.projectId)) {
          this.enrollButtonStatus = "InProject";
        } 
      }
    },
      error => {
        this.alert.alertError(error, 'ERROR: choseButtonStatus() -> UserProjects');
      });

    this.data.UserEnrolledProjects.subscribe(res => {
      if (res != null && res.find(pr => pr.Project.Id == this.projectId)) {
        this.enrollButtonStatus = "Unenrolling";
        res.forEach(p => {
          if (p.Project.Id == this.projectId) {
            this.projectEnrollId = p.Id;
          }
        })
      }
    },
      error => {
        this.alert.alertError(error, 'ERROR: choseButtonStatus() -> UserEnrolledProjects');
      });
  }
} 