import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsurancetypeCreateComponent } from './insurancetype-create.component';

describe('InsurancetypeCreateComponent', () => {
  let component: InsurancetypeCreateComponent;
  let fixture: ComponentFixture<InsurancetypeCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsurancetypeCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsurancetypeCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
 