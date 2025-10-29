import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CostAllocationViewComponent } from './cost-allocation-view.component';

describe('CostAllocationViewComponent', () => {
  let component: CostAllocationViewComponent;
  let fixture: ComponentFixture<CostAllocationViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CostAllocationViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostAllocationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
