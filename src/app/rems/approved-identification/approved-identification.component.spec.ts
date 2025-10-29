import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedIdentificationComponent } from './approved-identification.component';

describe('ApprovedIdentificationComponent', () => {
  let component: ApprovedIdentificationComponent;
  let fixture: ComponentFixture<ApprovedIdentificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovedIdentificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovedIdentificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
