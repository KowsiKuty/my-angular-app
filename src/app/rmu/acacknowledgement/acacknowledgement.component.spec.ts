import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcacknowledgementComponent } from './acacknowledgement.component';

describe('AcacknowledgementComponent', () => {
  let component: AcacknowledgementComponent;
  let fixture: ComponentFixture<AcacknowledgementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcacknowledgementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcacknowledgementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
