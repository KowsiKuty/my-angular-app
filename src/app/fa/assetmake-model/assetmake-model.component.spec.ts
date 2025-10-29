import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetmakeModelComponent } from './assetmake-model.component';

describe('AssetmakeModelComponent', () => {
  let component: AssetmakeModelComponent;
  let fixture: ComponentFixture<AssetmakeModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetmakeModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetmakeModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
