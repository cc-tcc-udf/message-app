import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpInterceptor } from './http.interceptor';
import { AuthService } from '@auth/auth.service';
import { AlertService } from './services/alert.service';
import { ThemeService } from './services/theme.service';

describe('HttpInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let alertServiceSpy: jasmine.SpyObj<AlertService>;
  let themeServiceSpy: jasmine.SpyObj<ThemeService>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'isAuthenticated',
      'isTokenExpired',
      'getAccessToken',
      'refreshToken',
      'logout'
    ]);
    alertServiceSpy = jasmine.createSpyObj('AlertService', ['showMsg', 'getSeverity']);
    alertServiceSpy.getSeverity.and.returnValue('error');
    themeServiceSpy = jasmine.createSpyObj('ThemeService', ['show', 'hide']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([HttpInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: AlertService, useValue: alertServiceSpy },
        { provide: ThemeService, useValue: themeServiceSpy },
      ]
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add Authorization header when user is authenticated with valid token', () => {
    authServiceSpy.isAuthenticated.and.returnValue(true);
    authServiceSpy.isTokenExpired.and.returnValue(false);
    authServiceSpy.getAccessToken.and.returnValue('fake-jwt-token');

    http.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.has('Authorization')).toBeTrue();
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-jwt-token');
    req.flush({});
    expect(themeServiceSpy.hide).toHaveBeenCalled();
  });

  it('should not add Authorization header when user is not authenticated', () => {
    authServiceSpy.isAuthenticated.and.returnValue(false);

    http.get('/api/public').subscribe();

    const req = httpMock.expectOne('/api/public');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
    expect(themeServiceSpy.hide).toHaveBeenCalled();
  });

  it('should trigger alert and logout on 401 Unauthorized', () => {
    authServiceSpy.isAuthenticated.and.returnValue(false);

    http.get('/api/protected').subscribe({
      error: (err) => {
        expect(err.status).toBe(401);
      }
    });

    const req = httpMock.expectOne('/api/protected');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(alertServiceSpy.showMsg).toHaveBeenCalledWith('error', 'Sessão Expirada', jasmine.any(String));
  });
});
