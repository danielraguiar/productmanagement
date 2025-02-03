import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '@env/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should authenticate user and store token', () => {
      const credentials = { username: 'test', password: 'test123' };
      const mockResponse = {
        username: 'test',
        roles: ['ROLE_USER']
      };

      service.login(credentials.username, credentials.password).subscribe(response => {
        expect(response).toBeTruthy();
        expect(localStorage.getItem('token')).toBeTruthy();
        expect(localStorage.getItem('currentUser')).toBeTruthy();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/auth/login`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should update login state after successful login', () => {
      const credentials = { username: 'test', password: 'test123' };
      const mockResponse = {
        username: 'test',
        roles: ['ROLE_USER']
      };

      service.login(credentials.username, credentials.password).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/api/auth/login`);
      req.flush(mockResponse);

      service.isLoggedIn$.subscribe(isLoggedIn => {
        expect(isLoggedIn).toBe(true);
      });
    });
  });

  describe('logout', () => {
    it('should clear storage and update login state', () => {
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('currentUser', JSON.stringify({ username: 'test' }));

      service.logout();

      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('currentUser')).toBeNull();

      service.isLoggedIn$.subscribe(isLoggedIn => {
        expect(isLoggedIn).toBe(false);
      });
    });
  });
}); 