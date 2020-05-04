import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { catchError } from 'rxjs/operators';
import { RestaurantService } from '../services/restaurant.service';
import { IRestaurantGet } from '../models/restaurant-get.interface';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-restaurant-detail',
  templateUrl: './restaurant-detail.component.html',
  styleUrls: ['./restaurant-detail.component.css'],
  providers: [RestaurantService]
})
export class RestaurantDetailComponent implements OnInit, OnDestroy {
  restaurantId: string;

  restaurant: IRestaurantGet;

  error: any;

  constructor(
    private route: ActivatedRoute,
    private _restaurantService: RestaurantService
  ) { }

  ngOnInit(): void {
    this.restaurantId = this.route.snapshot.paramMap.get('id');

    this._restaurantService.getRestaurantById(this.restaurantId).pipe(
      untilDestroyed(this),
      catchError(err => {
        this.error = err;
        return of({} as IRestaurantGet);
      })
    )
    .subscribe(restaurant => {
      this.restaurant = restaurant;
    });
  }

  ngOnDestroy(): void {}
}
