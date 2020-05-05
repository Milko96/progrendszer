import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

import { IRestaurantList } from '../models/restaurant-list.interface';
import { IRestaurantGet } from '../models/restaurant-get.interface';
import { IReservationPost } from '../models/reservation-post.interface';

@Injectable()
export class RestaurantService {
  constructor(private _http: HttpClient) {}

  public getRestaurants(): Observable<IRestaurantList[]> {
    return this._http.get<IRestaurantList[]>(`${environment.apiUrl}/restaurants`);
  }

  public getRestaurantById(id: string): Observable<IRestaurantGet> {
    return this._http.get<IRestaurantGet>(`${environment.apiUrl}/restaurants/${id}`);
  }

  public reserveTable(restaurantId: string, dto: IReservationPost): any {
    return this._http.post(`${environment.apiUrl}/restaurants/${restaurantId}/reservation`, dto);
  }
}
