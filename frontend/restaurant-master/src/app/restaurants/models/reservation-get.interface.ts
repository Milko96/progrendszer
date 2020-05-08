import { IUserBasic } from 'src/app/auth/models/user-basic.interface';

export interface IReservationGet {
    _id: string;
    reservedBy: IUserBasic;
    reservedSeats: number;
    datetime: Date;
    orders: IReservationOrderGet;
}

export interface IReservationOrderGet {
    foods: IReservationOrderFoodGet[];
    drinks: IReservationOrderDrinkGet[];
}

export interface IReservationOrderFoodGet {
    foodId: string;
    quantity: number;
}

export interface IReservationOrderDrinkGet {
    drinkId: string;
    quantity: number;
}