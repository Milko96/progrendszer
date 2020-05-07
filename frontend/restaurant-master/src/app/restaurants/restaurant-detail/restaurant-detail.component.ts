import { Component, OnInit, OnDestroy } from '@angular/core';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { catchError } from 'rxjs/operators';
import { RestaurantService } from '../services/restaurant.service';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { IRestaurantMenuItemGet, IRestaurantBasicGet } from '../models/restaurant-get-basic.interface';

@Component({
  selector: 'app-restaurant-detail',
  templateUrl: './restaurant-detail.component.html',
  styleUrls: ['./restaurant-detail.component.css'],
  providers: [RestaurantService]
})
export class RestaurantDetailComponent implements OnInit, OnDestroy {
  restaurantId: string;
  
  public activeTab: string = 'foods';
  
  restaurant: IRestaurantBasicGet;

  menuDataSource: IRestaurantMenuItemGet[];

  error: any;

  constructor(
    private route: ActivatedRoute,
    private _restaurantService: RestaurantService
  ) { }

  ngOnInit(): void {
    this.restaurantId = this.route.snapshot.paramMap.get('id');

    this._restaurantService.getRestaurantBasicById(this.restaurantId)
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
  }

  ngOnDestroy(): void {}

  changeActiveTab(activeTab: string){
    this.activeTab = activeTab;
    this.menuDataSource = this.activeTab === 'foods' ? this.restaurant.menu.foods : this.restaurant.menu.drinks;
  }
}
