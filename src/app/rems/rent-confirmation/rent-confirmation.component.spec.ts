import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RentConfirmationComponent } from './rent-confirmation.component';

describe('RentConfirmationComponent', () => {
  let component: RentConfirmationComponent;
  let fixture: ComponentFixture<RentConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
