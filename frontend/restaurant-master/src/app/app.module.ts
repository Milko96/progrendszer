import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RestaurantListComponent } from './restaurants/restaurant-list/restaurant-list.component';
import { RestaurantDetailComponent } from './restaurants/restaurant-detail/restaurant-detail.component';
import { CredentialsInterceptor } from './auth/credential-interceptor';
import { ReservationCreateComponent } from './restaurants/reservations/reservation-create/reservation-create.component';
import { ReservationListComponent } from './restaurants/reservations/reservation-list/reservation-list.component';
import { ReservationDetailComponent } from './restaurants/reservations/reservation-detail/reservation-detail.component';
import { RegistrationComponent } from './registration/registration.component';
import { DateTimeFormatPipe } from './date-time.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    RestaurantListComponent,
    RestaurantDetailComponent,
    ReservationCreateComponent,
    ReservationListComponent,
    ReservationDetailComponent,
    RegistrationComponent,
    DateTimeFormatPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CredentialsInterceptor ,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
