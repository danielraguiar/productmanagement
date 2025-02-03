import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  private apiUrl = `${environment.apiUrl}/api/auth`;
  private isLoggedInSubject = new BehaviorSubject<boolean>(
    !!(localStorage.getItem('token') && localStorage.getItem('currentUser'))
  );
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('currentUser') || '{}')
    );
    this.currentUser = this.currentUserSubject.asObservable();
    
    let token = localStorage.getItem('token');
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    if (!token && currentUser.token) {
      token = currentUser.token;
      localStorage.setItem('token', token);
    }

    if (token && currentUser) {
      this.isLoggedInSubject.next(true);
    }
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    return this.http.post(`${this.apiUrl}/login`, { username, password })
      .pipe(
        map(response => {
          const token = btoa(`${username}:${password}`);
          const user = {
            username: username,
            ...response,
            token: token
          };
          
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('token', token);
          
          this.currentUserSubject.next(user);
          this.isLoggedInSubject.next(true);
          return user;
        })
      );
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
  }

  updateLoginState(isLoggedIn: boolean) {
    this.isLoggedInSubject.next(isLoggedIn);
  }
} 