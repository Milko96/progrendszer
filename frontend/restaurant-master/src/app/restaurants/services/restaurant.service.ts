import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

import { IRestaurantList } from '../models/restaurant-list.interface';
import { IRestaurantBasicGet } from '../models/restaurant-get-basic.interface';
import { IReservationPost } from '../models/reservation-post.interface';
import { IRestaurantGet } from '../models/restaurant-get.interface';
import { IOrderPost } from '../models/order-post.interface';

@Injectable()
export class RestaurantService {
  constructor(private _http: HttpClient) {}

  public getRestaurants(): Observable<IRestaurantList[]> {
    return this._http.get<IRestaurantList[]>(`${environment.apiUrl}/restaurants`);
  }

  public getRestaurantBasicById(id: string): Observable<IRestaurantBasicGet> {
    return this._http.get<IRestaurantBasicGet>(`${environment.apiUrl}/restaurants/${id}/basic`);
  }
  
  public getRestaurantById(id: string): Observable<IRestaurantGet> {
    return this._http.get<IRestaurantGet>(`${environment.apiUrl}/restaurants/${id}`);
  }
  
  public reserveTable(restaurantId: string, dto: IReservationPost): any {
    return this._http.post(`${environment.apiUrl}/restaurants/${restaurantId}/reservations`, dto);
  }

  public orderFoodToReservation(restaurantId: string, reservationId: string, dto: IOrderPost): any {
    return this._http.patch(`${environment.apiUrl}/restaurants/${restaurantId}/reservations/${reservationId}/order-food`, dto);
  }
  
  public orderDrinkToReservation(restaurantId: string, reservationId: string, dto: IOrderPost): any {
    return this._http.patch(`${environment.apiUrl}/restaurants/${restaurantId}/reservations/${reservationId}/order-drink`, dto);
  }

  public deleteReservation(restaurantId: string, reservationId: string): any {
    return this._http.delete(`${environment.apiUrl}/restaurants/${restaurantId}/reservations/${reservationId}`);
  }
}
