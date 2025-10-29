import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiseDetailsViewComponent } from './premise-details-view.component';

describe('PremiseDetailsViewComponent', () => {
  let component: PremiseDetailsViewComponent;
  let fixture: ComponentFixture<PremiseDetailsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PremiseDetailsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PremiseDetailsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
