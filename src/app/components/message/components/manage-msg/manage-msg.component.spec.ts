import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageMsgComponent } from './manage-msg.component';

describe('ManageMsgComponent', () => {
  let component: ManageMsgComponent;
  let fixture: ComponentFixture<ManageMsgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageMsgComponent]
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
