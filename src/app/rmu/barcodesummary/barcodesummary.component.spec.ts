import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarcodesummaryComponent } from './barcodesummary.component';

describe('BarcodesummaryComponent', () => {
  let component: BarcodesummaryComponent;
  let fixture: ComponentFixture<BarcodesummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarcodesummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarcodesummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
