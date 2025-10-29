import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowUpLeadsAndTaskComponent } from './follow-up-leads-and-task.component';

describe('FollowUpLeadsAndTaskComponent', () => {
  let component: FollowUpLeadsAndTaskComponent;
  let fixture: ComponentFixture<FollowUpLeadsAndTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FollowUpLeadsAndTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowUpLeadsAndTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
