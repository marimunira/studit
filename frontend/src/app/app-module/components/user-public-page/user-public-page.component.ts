import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { UserService } from 'services/user.service';
import { CurrentUser } from 'models/current-user';

@Component({
  selector: 'app-user-public-page',
  templateUrl: './user-public-page.component.html',
  styleUrls: ['./user-public-page.component.css']
})
export class UserPublicPageComponent implements OnInit {

  private currentUser: BehaviorSubject<CurrentUser> = new BehaviorSubject(new CurrentUser());

  constructor(private userService: UserService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params
      .subscribe(params => {
        this.userService.getUserById(+params['id'])
          .subscribe(res => {
            let c: CurrentUser = new (CurrentUser);
            c.User.Avatar = res.Avatar;
            c.User.Id = +res.Id;
            c.User.Description = res.Description;
            c.User.Nickname = res.Nickname;
            this.currentUser.next(c);
          });
      });
  }
}
