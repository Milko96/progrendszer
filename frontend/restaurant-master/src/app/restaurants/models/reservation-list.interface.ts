export interface IReservationList {
    _id: string;
    tableIdentifier: string;
    reservedBy: string; // user_id, de jó lenne konkrét user
    reservedSeats: number;
    datetime: Date;
}