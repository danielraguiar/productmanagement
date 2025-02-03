import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;
  isSidenavOpen = true;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.isLoggedIn$.subscribe(isLoggedIn => {
      console.log('Login state:', isLoggedIn);
      console.log('Token:', localStorage.getItem('token'));
      console.log('Current User:', localStorage.getItem('currentUser'));
    });
  }

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      this.authService.updateLoginState(true);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
} 