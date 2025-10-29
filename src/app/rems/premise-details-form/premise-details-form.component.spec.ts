import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiseDetailsFormComponent } from './premise-details-form.component';

describe('PremiseDetailsFormComponent', () => {
  let component: PremiseDetailsFormComponent;
  let fixture: ComponentFixture<PremiseDetailsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PremiseDetailsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PremiseDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
