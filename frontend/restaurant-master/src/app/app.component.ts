import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './auth/auth.service';
import { User } from './interfaces/user.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  currentUser: User;

  public activeTab: string = 'home';

  constructor(
    private router: Router,
    private authService: AuthService
  ){
    this.authService.currentUser.subscribe(x => this.currentUser = x);
  }

  changeActiveTab(activeTab: string){
    this.activeTab = activeTab;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
