import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomleadsComponent } from './customleads.component';

describe('CustomleadsComponent', () => {
  let component: CustomleadsComponent;
  let fixture: ComponentFixture<CustomleadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomleadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomleadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
