import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitydesignationmasterComponent } from './activitydesignationmaster.component';

describe('ActivitydesignationmasterComponent', () => {
  let component: ActivitydesignationmasterComponent;
  let fixture: ComponentFixture<ActivitydesignationmasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivitydesignationmasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitydesignationmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
