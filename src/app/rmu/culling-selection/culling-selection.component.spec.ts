import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CullingSelectionComponent } from './culling-selection.component';

describe('CullingSelectionComponent', () => {
  let component: CullingSelectionComponent;
  let fixture: ComponentFixture<CullingSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CullingSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CullingSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
