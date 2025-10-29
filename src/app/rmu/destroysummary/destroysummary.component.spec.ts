import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DestroysummaryComponent } from './destroysummary.component';

describe('DestroysummaryComponent', () => {
  let component: DestroysummaryComponent;
  let fixture: ComponentFixture<DestroysummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DestroysummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DestroysummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
