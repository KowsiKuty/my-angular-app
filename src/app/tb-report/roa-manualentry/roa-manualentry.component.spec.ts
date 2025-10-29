import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoaManualentryComponent } from './roa-manualentry.component';

describe('RoaManualentryComponent', () => {
  let component: RoaManualentryComponent;
  let fixture: ComponentFixture<RoaManualentryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoaManualentryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoaManualentryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
