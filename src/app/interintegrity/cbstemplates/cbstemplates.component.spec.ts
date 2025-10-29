import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CbstemplatesComponent } from './cbstemplates.component';

describe('CbstemplatesComponent', () => {
  let component: CbstemplatesComponent;
  let fixture: ComponentFixture<CbstemplatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CbstemplatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CbstemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
