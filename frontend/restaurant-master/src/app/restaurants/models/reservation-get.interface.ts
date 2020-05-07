export interface IReservationGet {
    _id: string;
    reservedBy: string; // user_id, de jó lenne konkrét user
    reservedSeats: number;
    datetime: Date;
    orders: IReservationOrderGet;
}

export interface IReservationOrderGet {
    foods: IReservationOrderFoodGet[];
    drinks: IReservationOrderDrinkGet[];
}

export interface IReservationOrderFoodGet {
    food: string;
    quantity: number;
}

export interface IReservationOrderDrinkGet {
    drink: string;
    quantity: number;
}