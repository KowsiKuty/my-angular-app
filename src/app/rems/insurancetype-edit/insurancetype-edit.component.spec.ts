import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsurancetypeEditComponent } from './insurancetype-edit.component';

describe('InsurancetypeEditComponent', () => {
  let component: InsurancetypeEditComponent;
  let fixture: ComponentFixture<InsurancetypeEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsurancetypeEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsurancetypeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
 