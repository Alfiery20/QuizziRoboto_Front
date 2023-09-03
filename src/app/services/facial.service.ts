import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Login, Register } from '../interfaces/user';


@Injectable({
    providedIn: 'root',
})
export class FacialService {
    constructor(private http: HttpClient) { }

    login(login: Login) {
        const url = environment.base_url + '/login';
        return this.http.post(url, login).pipe(
            map((resp: any) => {
                return resp;
            })
        );
    }

    register(register: Register) {
        const url = environment.base_url + '/register';
        return this.http.post(url, register).pipe(
            map((resp: any) => {
                return resp;
            })
        );
    }
}