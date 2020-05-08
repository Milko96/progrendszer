import { IUserBasic } from 'src/app/auth/models/user-basic.interface';

export interface IReservationList {
    _id: string;
    tableIdentifier: string;
    reservedBy: IUserBasic;
    reservedSeats: number;
    datetime: Date;
}