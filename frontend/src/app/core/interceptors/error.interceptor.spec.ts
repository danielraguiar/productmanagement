import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ErrorInterceptor } from './error.interceptor';
import { NotificationService } from '@core/services/notification.service';

describe('ErrorInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let notificationService: jasmine.SpyObj<NotificationService>;

  beforeEach(() => {
    const notificationSpy = jasmine.createSpyObj('NotificationService', ['error']);
    
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ErrorInterceptor,
          multi: true
        },
        { provide: NotificationService, useValue: notificationSpy }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should handle 401 unauthorized error', () => {
    httpClient.get('/api/test').subscribe({
      error: (error) => {
        expect(error.status).toBe(401);
        expect(notificationService.error).toHaveBeenCalledWith('Unauthorized access');
      }
    });

    const req = httpMock.expectOne('/api/test');
    req.flush('Unauthorized', {
      status: 401,
      statusText: 'Unauthorized'
    });
  });

  it('should handle 500 server error', () => {
    httpClient.get('/api/test').subscribe({
      error: (error) => {
        expect(error.status).toBe(500);
        expect(notificationService.error).toHaveBeenCalledWith('Server error');
      }
    });

    const req = httpMock.expectOne('/api/test');
    req.flush('Server error', {
      status: 500,
      statusText: 'Internal Server Error'
    });
  });
}); 