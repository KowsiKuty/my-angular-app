import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketFollowupComponent } from './ticket-followup.component';

describe('TicketFollowupComponent', () => {
  let component: TicketFollowupComponent;
  let fixture: ComponentFixture<TicketFollowupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketFollowupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketFollowupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
