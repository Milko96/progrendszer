import { IUserBasic } from './user-basic.interface';

export interface IUser extends IUserBasic {
    role: string;
    waiterAt?: string;
}