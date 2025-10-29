import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetspecificationComponent } from './assetspecification.component';

describe('AssetspecificationComponent', () => {
  let component: AssetspecificationComponent;
  let fixture: ComponentFixture<AssetspecificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetspecificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetspecificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
