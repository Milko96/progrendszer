import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { catchError } from 'rxjs/operators';
import { RestaurantService } from '../services/restaurant.service';
import { of } from 'rxjs';
import { IRestaurantList } from '../models/restaurant-list.interface';

@Component({
  selector: 'app-restaurant-list',
  templateUrl: './restaurant-list.component.html',
  styleUrls: ['./restaurant-list.component.css'],
  providers: [RestaurantService]
})
export class RestaurantListComponent implements OnInit, OnDestroy {
  public activeTab = 'restaurants';

  restaurants: IRestaurantList[];

  error: any;
  
  constructor(
    private _router: Router,
    private _restaurantService: RestaurantService
  ) { }

  ngOnInit(): void {
    this._restaurantService.getRestaurants().pipe(
      untilDestroyed(this),
      catchError(err => {
        this.error = err;
        return of([] as IRestaurantList[]);
      })
    )
    .subscribe(restaurants => {
      this.restaurants = restaurants;
    });
  }

  loadRestaurant(restaurantId: string){
    this._router.navigate(['/restaurants', restaurantId]);
  }

  ngOnDestroy(): void {}
}
