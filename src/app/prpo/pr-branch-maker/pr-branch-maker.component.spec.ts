import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrBranchMakerComponent } from './pr-branch-maker.component';

describe('PrBranchMakerComponent', () => {
  let component: PrBranchMakerComponent;
  let fixture: ComponentFixture<PrBranchMakerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrBranchMakerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrBranchMakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
