import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NonOwnedAssetMakerComponent } from './non-owned-asset-maker.component';

describe('NonOwnedAssetMakerComponent', () => {
  let component: NonOwnedAssetMakerComponent;
  let fixture: ComponentFixture<NonOwnedAssetMakerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NonOwnedAssetMakerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NonOwnedAssetMakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
