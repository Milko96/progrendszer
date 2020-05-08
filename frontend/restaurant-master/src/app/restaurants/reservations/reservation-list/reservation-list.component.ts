import { Component, OnInit, OnDestroy } from '@angular/core';
import { RestaurantService } from '../../services/restaurant.service';
import { IRestaurantGet } from '../../models/restaurant-get.interface';
import { IUser } from 'src/app/auth/models/user.interface';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { IReservationList } from '../../models/reservation-list.interface';
import { IReservationGet } from '../../models/reservation-get.interface';

@Component({
  selector: 'app-reservation-list',
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.css'],
  providers: [RestaurantService]
})
export class ReservationListComponent implements OnInit, OnDestroy {
  currentUser: IUser;
  restaurantId: string;

  restaurant: IRestaurantGet;

  reservations: IReservationList[] = [];

  selectedReservation?: IReservationGet;

  error: any;

  constructor(
    private _restaurantService: RestaurantService
  ) { }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.restaurantId = this.currentUser.waiterAt;

    this._restaurantService.getRestaurantById(this.restaurantId)
      .pipe(
        untilDestroyed(this),
        catchError(err => {
          this.error = err;
          return of(null);
        })
      )
      .subscribe(restaurant => {
        this.restaurant = restaurant;

        this.restaurant.tables.forEach(table => {
          table.reservations.forEach(reservation => {
            var convertedDate = new Date(reservation.datetime);
            this.reservations.push({
              _id: reservation._id,
              tableIdentifier: table.identifier,
              reservedBy: reservation.reservedBy,
              reservedSeats: reservation.reservedSeats,
              datetime: new Date(convertedDate.getTime() + (convertedDate.getTimezoneOffset()*60*1000))
            });
          });
        });
      });
  }

  ngOnDestroy(): void {}

  deleteReservation(reservationId: string){
    this._restaurantService.deleteReservation(this.restaurantId, reservationId)
    .pipe(
      untilDestroyed(this),
      catchError(err => {
        this.error = err;
        return of(null);
      })
    )
    .subscribe(response => {

    });
  }

  selectReservation(tableIdentifier: string, reservationId: string){
    this.selectedReservation = this.restaurant.tables
      .find(table => table.identifier === tableIdentifier).reservations
      .find(reservation => reservation._id === reservationId);
  }
}
