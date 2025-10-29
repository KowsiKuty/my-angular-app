import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiseBrokerDetailsFormComponent } from './premise-broker-details-form.component';

describe('PremiseBrokerDetailsFormComponent', () => {
  let component: PremiseBrokerDetailsFormComponent;
  let fixture: ComponentFixture<PremiseBrokerDetailsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PremiseBrokerDetailsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PremiseBrokerDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
