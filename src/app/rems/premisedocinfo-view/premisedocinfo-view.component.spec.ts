import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PremisedocinfoViewComponent } from './premisedocinfo-view.component';

describe('PremisedocinfoViewComponent', () => {
  let component: PremisedocinfoViewComponent;
  let fixture: ComponentFixture<PremisedocinfoViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PremisedocinfoViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PremisedocinfoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
