import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetmodificationComponent } from './assetmodification.component';

describe('AssetmodificationComponent', () => {
  let component: AssetmodificationComponent;
  let fixture: ComponentFixture<AssetmodificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetmodificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetmodificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
