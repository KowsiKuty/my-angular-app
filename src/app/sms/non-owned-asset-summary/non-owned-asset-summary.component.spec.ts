import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NonOwnedAssetSummaryComponent } from './non-owned-asset-summary.component';

describe('NonOwnedAssetSummaryComponent', () => {
  let component: NonOwnedAssetSummaryComponent;
  let fixture: ComponentFixture<NonOwnedAssetSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NonOwnedAssetSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NonOwnedAssetSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
