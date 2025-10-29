import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaActiveInactiveComponent } from './fa-active-inactive.component';

describe('FaActiveInactiveComponent', () => {
  let component: FaActiveInactiveComponent;
  let fixture: ComponentFixture<FaActiveInactiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaActiveInactiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaActiveInactiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
