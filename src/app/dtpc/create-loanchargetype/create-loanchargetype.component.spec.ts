import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLoanchargetypeComponent } from './create-loanchargetype.component';

describe('CreateLoanchargetypeComponent', () => {
  let component: CreateLoanchargetypeComponent;
  let fixture: ComponentFixture<CreateLoanchargetypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateLoanchargetypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLoanchargetypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
