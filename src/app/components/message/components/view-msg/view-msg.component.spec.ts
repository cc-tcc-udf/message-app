import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { ViewMsgComponent } from './view-msg.component';

describe('ViewMsgComponent', () => {
  let component: ViewMsgComponent;
  let fixture: ComponentFixture<ViewMsgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewMsgComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        DialogService
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewMsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
