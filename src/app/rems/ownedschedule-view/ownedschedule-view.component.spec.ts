import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnedscheduleViewComponent } from './ownedschedule-view.component';

describe('OwnedscheduleViewComponent', () => {
  let component: OwnedscheduleViewComponent;
  let fixture: ComponentFixture<OwnedscheduleViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnedscheduleViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnedscheduleViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
