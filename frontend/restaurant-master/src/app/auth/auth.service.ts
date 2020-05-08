import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { IUser } from './models/user.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private currentUserSubject: BehaviorSubject<IUser>;
    public currentUser: Observable<IUser>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<IUser>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): IUser {
        return this.currentUserSubject.value;
    }

    register(username, password){
        return this.http.post<any>(`${environment.apiUrl}/registrate`, { username, password });
    }

    login(username, password) {
        return this.http.post<any>(`${environment.apiUrl}/login`, { username, password })
            .pipe(map(user => {
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
                return user;
            }));
    }

    logout() {
        this.http.post<any>(`${environment.apiUrl}/logout`, {}); // todo ez nem akar meghívódni
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}