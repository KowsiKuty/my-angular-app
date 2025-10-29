import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetDetailsComponentComponent } from './asset-details-component.component';

describe('AssetDetailsComponentComponent', () => {
  let component: AssetDetailsComponentComponent;
  let fixture: ComponentFixture<AssetDetailsComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetDetailsComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetDetailsComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
