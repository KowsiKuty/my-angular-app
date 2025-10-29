import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RentArrearFormComponent } from './rent-arrear-form.component';

describe('RentArrearFormComponent', () => {
  let component: RentArrearFormComponent;
  let fixture: ComponentFixture<RentArrearFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentArrearFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentArrearFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
