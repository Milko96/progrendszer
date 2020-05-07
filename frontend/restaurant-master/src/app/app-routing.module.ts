import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { RestaurantListComponent } from './restaurants/restaurant-list/restaurant-list.component';
import { RestaurantDetailComponent } from './restaurants/restaurant-detail/restaurant-detail.component';
import { ReservationListComponent } from './restaurants/reservations/reservation-list/reservation-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    {
      path: 'restaurants',
      component: RestaurantListComponent,
      canActivate: [AuthGuard],
      data: { roles: ['guest'] }
    },
    { path: 'restaurants/:id', component: RestaurantDetailComponent, canActivate: [AuthGuard] },
    {
      path: 'reservations',
      component: ReservationListComponent,
      canActivate: [AuthGuard],
      data: { roles: ['waiter'] }
    },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
