import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { catchError } from 'rxjs/operators';
import { RestaurantService } from '../services/restaurant.service';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { IRestaurantGet, IRestaurantMenuItemGet } from '../models/restaurant-get.interface';
import { IReservationPost } from '../models/reservation-post.interface';

@Component({
  selector: 'app-restaurant-detail',
  templateUrl: './restaurant-detail.component.html',
  styleUrls: ['./restaurant-detail.component.css'],
  providers: [RestaurantService]
})
export class RestaurantDetailComponent implements OnInit, OnDestroy {
  restaurantId: string;
  
  public activeTab: string = 'foods';
  
  restaurant: IRestaurantGet;

  menuDataSource: IRestaurantMenuItemGet[];

  reservationForm: FormGroup;
  loading = false;
  submitted = false;
  error: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private _restaurantService: RestaurantService
  ) { }

  ngOnInit(): void {
    this.restaurantId = this.route.snapshot.paramMap.get('id');

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
        this.menuDataSource = this.activeTab === 'foods' ? this.restaurant.menu.foods : this.restaurant.menu.drinks;
      });

      this.reservationForm = this.formBuilder.group({
        datetime: [Date, Validators.required],
        reservedSeats: [Number, [Validators.required, Validators.min(1)]]
      });
  }

  ngOnDestroy(): void {}

  changeActiveTab(activeTab: string){
    this.activeTab = activeTab;
    this.menuDataSource = this.activeTab === 'foods' ? this.restaurant.menu.foods : this.restaurant.menu.drinks;
  }

  onSubmit() { 
    this.submitted = true;

    if (this.reservationForm.invalid) {
        return;
    }

    this.loading = true;
    this._restaurantService.reserveTable(this.restaurantId, this.buildReservationPostDto())
        .subscribe(
            data => {
            },
            error => {
                this.loading = false;
            });
  }

  buildReservationPostDto(): IReservationPost{
    return {
      datetime: this.reservationForm.controls.username.value, // todo ez csak a jövőben lehet
      reservedSeats: this.reservationForm.controls.password.value
    }
  }
}
