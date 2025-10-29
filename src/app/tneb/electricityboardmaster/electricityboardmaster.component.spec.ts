import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectricityboardmasterComponent } from './electricityboardmaster.component';

describe('ElectricityboardmasterComponent', () => {
  let component: ElectricityboardmasterComponent;
  let fixture: ComponentFixture<ElectricityboardmasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElectricityboardmasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElectricityboardmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
