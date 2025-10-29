import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrssummaryComponent } from './drssummary.component';

describe('DrssummaryComponent', () => {
  let component: DrssummaryComponent;
  let fixture: ComponentFixture<DrssummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrssummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrssummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
