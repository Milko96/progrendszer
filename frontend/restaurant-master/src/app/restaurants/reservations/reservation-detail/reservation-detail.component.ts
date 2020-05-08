import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { IRestaurantMenuGet } from '../../models/restaurant-get-basic.interface';
import { IReservationGet } from '../../models/reservation-get.interface';
import { IOrderList } from '../../models/order-list.interface';
import { FormGroup, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { RestaurantService } from '../../services/restaurant.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-reservation-detail',
  templateUrl: './reservation-detail.component.html',
  styleUrls: ['./reservation-detail.component.css']
})
export class ReservationDetailComponent implements OnInit, OnDestroy {
  @Input('restaurantId')
  restaurantId: string;

  @Input('selectedReservation')
  selectedReservation: IReservationGet;

  @Input('menu')
  menu: IRestaurantMenuGet;

  orderFoodForm: FormGroup;
  public selectedFood;
  
  orderDrinkForm: FormGroup;
  public selectedDrink;

  loading = false;
  submitted = false;

  ordersDataSource: IOrderList[] = [];
  
  error: any;

  constructor(
    private formBuilder: FormBuilder,
    private _restaurantService: RestaurantService
  ) { }

  ngOnInit(): void {
    console.log('selectedReservation', this.selectedReservation);

    this.orderFoodForm = this.formBuilder.group({
      foodSelector: [String, Validators.required],
      quantity: [Number, [Validators.required, Validators.min(1)]]
    });
    this.orderDrinkForm = this.formBuilder.group({
      drinkSelector: [String, Validators.required],
      quantity: [Number, [Validators.required, Validators.min(1)]]
    });

    console.log('this.selectedReservation.orders.foods', this.selectedReservation.orders.foods);
    this.selectedReservation.orders.foods.forEach(x => {
      const food = this.menu.foods.find(y => y._id === x.foodId);
      this.ordersDataSource.push({
        name: food.name,
        quantity: x.quantity,
        totalPrice: x.quantity * food.price
      });
    });
    console.log('this.selectedReservation.orders.drinks', this.selectedReservation.orders.drinks);
    this.selectedReservation.orders.drinks.forEach(x => {
      const drink = this.menu.drinks.find(y => y._id === x.drinkId);
      this.ordersDataSource.push({
        name: drink.name,
        quantity: x.quantity,
        totalPrice: x.quantity * drink.price
      });
    });
  }

  ngOnDestroy(): void {
  }

  onSubmitFoodForm() {
    console.log('this.selectedFood', this.selectedFood);
    this.submitted = true;

    if (this.orderFoodForm.invalid) {
        return;
    }

    this.loading = true;
    this._restaurantService.orderFoodToReservation(this.restaurantId, this.selectedReservation._id,
        { _id: this.selectedFood, quantity: this.orderFoodForm.controls.quantity.value }
      )
      .pipe(
        untilDestroyed(this),
        catchError(err => {
          this.error = err;
          this.loading = false;
          this.submitted = false;
          return of(null);
        })
      )
      .subscribe(response => {
        this.loading = false;
              this.submitted = false;
      });
  }
  
  onSubmitDrinkForm() {
    this.submitted = true;

    if (this.orderDrinkForm.invalid) {
        return;
    }

    this.loading = true;
    this._restaurantService.orderDrinkToReservation(this.restaurantId, this.selectedReservation._id,
        { _id: this.selectedDrink, quantity: this.orderDrinkForm.controls.quantity.value }
      )
      .pipe(
        untilDestroyed(this),
        catchError(err => {
          this.error = err;
          this.loading = false;
          this.submitted = false;
          return of(null);
        })
      )
      .subscribe(response => {
        this.loading = false;
              this.submitted = false;
      });
  }
}
