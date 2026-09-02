import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { environment } from '@env/env';
import { UserResponse } from '@models/UserResponse';
import { Login } from '@models/Usuario';
import { MessageService } from 'primeng/api';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        MessageService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: mockRouter },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    sessionStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return false when checking isAuthenticated without token', () => {
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('should return true when access_token exists in sessionStorage', () => {
    sessionStorage.setItem('access_token', 'mock.jwt.token');
    expect(service.isAuthenticated()).toBeTrue();
  });

  it('should clear sessionStorage and redirect to /auth/login on logout', () => {
    sessionStorage.setItem('access_token', 'mock.jwt.token');
    sessionStorage.setItem('user', JSON.stringify({ id: 1, name: 'User' }));

    service.logout();

    expect(sessionStorage.getItem('access_token')).toBeNull();
    expect(sessionStorage.getItem('user')).toBeNull();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login']);
  });

  it('should send POST request to login endpoint and store tokens', () => {
    const mockLogin = new Login({
      email: 'test@teste.com',
      password: 'password123',
      isMobile: false,
    });
    const mockToken =
      'header.' +
      btoa(
        JSON.stringify({
          sub: 'test@teste.com',
          exp: Math.floor(Date.now() / 1000) + 3600,
        }),
      ) +
      '.signature';
    const mockResponse: UserResponse = {
      token: mockToken,
      email: 'test@teste.com',
    };

    service.login(mockLogin).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.API_URL}/public/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.email).toBe(mockLogin.email);
    req.flush(mockResponse);

    const getUserReq = httpMock.expectOne(
      `${environment.API_URL}/private/auth/getUser?email=test%40teste.com`,
    );
    getUserReq.flush({ id: '1', name: 'Test User', email: 'test@teste.com' });

    expect(service.getAccessToken()).toBe(mockToken);
  });
});
