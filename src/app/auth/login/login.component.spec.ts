import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '@auth/auth.service';
import { UserResponse } from '@models/UserResponse';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'isAuthenticated', 'getAccessToken']);
    authServiceSpy.isAuthenticated.and.returnValue(false);
    const mockUserResponse: UserResponse = {
      token: 'fake-jwt-token',
      email: 'user@ibm.com'
    };
    authServiceSpy.login.and.returnValue(of(mockUserResponse));

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        MessageService,
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize login form with null values', () => {
    expect(component.form).toBeDefined();
    expect(component.form.get('email')?.value).toBeNull();
    expect(component.form.get('password')?.value).toBeNull();
  });

  it('should call auth.login when send() is invoked', () => {
    component.form.patchValue({
      email: 'user@ibm.com',
      password: 'password123'
    });

    component.send();

    expect(authServiceSpy.login).toHaveBeenCalledWith(jasmine.objectContaining({
      email: 'user@ibm.com',
      password: 'password123'
    }));
  });
});
