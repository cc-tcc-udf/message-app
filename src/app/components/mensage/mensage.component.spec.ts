import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MensageComponent } from './mensage.component';

describe('MensageComponent', () => {
  let component: MensageComponent;
  let fixture: ComponentFixture<MensageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MensageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MensageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
