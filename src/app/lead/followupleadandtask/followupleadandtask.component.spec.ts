import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowupleadandtaskComponent } from './followupleadandtask.component';

describe('FollowupleadandtaskComponent', () => {
  let component: FollowupleadandtaskComponent;
  let fixture: ComponentFixture<FollowupleadandtaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FollowupleadandtaskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowupleadandtaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
