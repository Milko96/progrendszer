import { IReservationGet } from './reservation-get.interface';

export interface IRestaurantGet {
    _id: string;
    name: string;
    openingHour: number;
    closingHour: number;
    menu: IRestaurantMenuGet;
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