export interface IRestaurantBasicGet {
    _id: string;
    name: string;
    openingHour: number;
    closingHour: number;
    menu: IRestaurantMenuGet;
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