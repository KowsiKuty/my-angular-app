import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseGlMappingComponent } from './expense-gl-mapping.component';

describe('ExpenseGlMappingComponent', () => {
  let component: ExpenseGlMappingComponent;
  let fixture: ComponentFixture<ExpenseGlMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenseGlMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseGlMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
