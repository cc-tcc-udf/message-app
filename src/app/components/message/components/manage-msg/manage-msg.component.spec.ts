import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ManageMsgComponent } from './manage-msg.component';

describe('ManageMsgComponent', () => {
  let component: ManageMsgComponent;
  let fixture: ComponentFixture<ManageMsgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageMsgComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        ConfirmationService,
        MessageService,
        DialogService
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageMsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
