import { IReservationGet } from './reservation-get.interface';
import { IRestaurantBasicGet } from './restaurant-get-basic.interface';

export interface IRestaurantGet extends IRestaurantBasicGet {
    tables: IRestaurantTableGet[];
}

export interface IRestaurantMenuGet {
    _id: string;
    foods: IRestaurantMenuItemGet[];
    drinks: IRestaurantMenuItemGet[];
}

export interface IRestaurantMenuItemGet {
    _id: string;
    name: string;
    price: number;
}

export interface IRestaurantTableGet {
    _id: string;
    identifier: string;
    seats: number;
    reservations: IReservationGet[];
}