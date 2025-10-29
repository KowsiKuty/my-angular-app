import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeetypemasterComponent } from './employeetypemaster.component';

describe('EmployeetypemasterComponent', () => {
  let component: EmployeetypemasterComponent;
  let fixture: ComponentFixture<EmployeetypemasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeetypemasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeetypemasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
