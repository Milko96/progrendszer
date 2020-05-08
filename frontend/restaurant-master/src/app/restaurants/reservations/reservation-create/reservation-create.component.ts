import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { RestaurantService } from '../../services/restaurant.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { IReservationPost } from '../../models/reservation-post.interface';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reservation-create',
  templateUrl: './reservation-create.component.html',
  styleUrls: ['./reservation-create.component.css'],
  providers: [RestaurantService]
})
export class ReservationCreateComponent implements OnInit, OnDestroy {
  restaurantId: string;

  reservationForm: FormGroup;
  loading = false;
  submitted = false;
  error: any;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private _restaurantService: RestaurantService
  ) { }

  ngOnInit(): void {
    this.restaurantId = this.route.snapshot.paramMap.get('id');

    this.reservationForm = this.formBuilder.group({
      datetime: [Date, Validators.required],
      reservedSeats: [Number, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnDestroy(): void {}

  onSubmit() { 
    this.submitted = true;

    if (this.reservationForm.invalid) {
        return;
    }

    this.loading = true;
    this._restaurantService.reserveTable(this.restaurantId, this.buildReservationPostDto())
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

  buildReservationPostDto(): IReservationPost{
    return {
      datetime: this.reservationForm.controls.datetime.value, // todo ez csak a jövőben lehet
      reservedSeats: this.reservationForm.controls.reservedSeats.value
    }
  }
}
