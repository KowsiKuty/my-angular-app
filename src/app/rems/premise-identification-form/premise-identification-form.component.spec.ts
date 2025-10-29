import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiseIdentificationFormComponent } from './premise-identification-form.component';

describe('PremiseIdentificationFormComponent', () => {
  let component: PremiseIdentificationFormComponent;
  let fixture: ComponentFixture<PremiseIdentificationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PremiseIdentificationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PremiseIdentificationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
