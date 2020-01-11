import { Injectable } from '@angular/core';
import { AuthData } from './auth-data.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

const apiUrl = environment.API_URL + '/basic/login';

@Injectable({providedIn: 'root'})
export class AuthService {

  currentUser: string = null;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  login(username: string, password: string) {
    const user: AuthData = { username, password };
    this.router.navigate(['/configuration-tools']);
    // console.log(user);
    // this.http.post<{ code: number; data: any; errorMessage: string; message: string }>(apiUrl, user).subscribe(
    //   res => {
    //     // console.log(res);
    //     if (res.code === 1000) {
    //       this.currentUser = res.data;
    //       this.router.navigate(['/configuration-tools']);
    //     }
    //   },
    //   err => {
    //     console.log(err);
    //   }
    // );
  }
}
