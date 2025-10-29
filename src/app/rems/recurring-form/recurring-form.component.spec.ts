import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecurringFormComponent } from './recurring-form.component';

describe('RecurringFormComponent', () => {
  let component: RecurringFormComponent;
  let fixture: ComponentFixture<RecurringFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecurringFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecurringFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
