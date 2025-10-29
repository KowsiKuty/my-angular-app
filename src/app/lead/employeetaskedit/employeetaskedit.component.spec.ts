import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeetaskeditComponent } from './employeetaskedit.component';

describe('EmployeetaskeditComponent', () => {
  let component: EmployeetaskeditComponent;
  let fixture: ComponentFixture<EmployeetaskeditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeetaskeditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeetaskeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
