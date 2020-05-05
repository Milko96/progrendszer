export interface IRestaurantGet {
    _id: string;
    name: string;
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
}