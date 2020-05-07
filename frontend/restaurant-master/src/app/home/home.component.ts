import { Component, OnInit } from '@angular/core';

import { IUser } from '../auth/models/user.interface';
import { AuthService } from '../auth/auth.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentUser: IUser;

  constructor(
    private authService: AuthService
  ) {
    
    this.currentUser = this.authService.currentUserValue;
  }

  ngOnInit(): void {
  }

}
