import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  error = '';
  returnUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    if (this.authService.currentUserValue?.token) {
      this.router.navigate(['/']);
    }

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    const username = this.loginForm.get('username').value;
    const password = this.loginForm.get('password').value;

    this.authService.login(username, password)
      .pipe(first())
      .subscribe({
        next: (data) => {
          console.log('Login bem sucedido:', data);
          this.notificationService.success('Login realizado com sucesso!');
          this.router.navigate([this.returnUrl]);
        },
        error: (error) => {
          console.error('Erro no login:', error);
          this.error = error.error?.error || 'Falha na autenticação';
          this.notificationService.error(this.error);
          this.loading = false;
        }
      });
  }
} 