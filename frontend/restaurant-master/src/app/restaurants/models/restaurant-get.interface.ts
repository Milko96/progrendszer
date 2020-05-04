export interface IRestaurantGet {
    _id: string;
    name: string;
    menu: IRestaurantMenuGet[];
    tables: IRestaurantTableGet[];
}

export interface IRestaurantMenuGet {
    _id: string;
    foods: IRestaurantMenuFoodGet[];
    drinks: IRestaurantMenuFoodGet[];
}

export interface IRestaurantMenuFoodGet {
    _id: string;
    name: string;
    price: number;
}

export interface IRestaurantTableGet {
    _id: string;
    identifier: string;
}