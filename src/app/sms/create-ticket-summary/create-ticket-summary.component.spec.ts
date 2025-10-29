import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTicketSummaryComponent } from './create-ticket-summary.component';

describe('CreateTicketSummaryComponent', () => {
  let component: CreateTicketSummaryComponent;
  let fixture: ComponentFixture<CreateTicketSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTicketSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTicketSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
