import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiseIdentificationViewComponent } from './premise-identification-view.component';

describe('PremiseIdentificationViewComponent', () => {
  let component: PremiseIdentificationViewComponent;
  let fixture: ComponentFixture<PremiseIdentificationViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PremiseIdentificationViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PremiseIdentificationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
