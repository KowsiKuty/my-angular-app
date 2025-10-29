import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddElectricityDetailsComponent } from './add-electricity-details.component';

describe('AddElectricityDetailsComponent', () => {
  let component: AddElectricityDetailsComponent;
  let fixture: ComponentFixture<AddElectricityDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddElectricityDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddElectricityDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
