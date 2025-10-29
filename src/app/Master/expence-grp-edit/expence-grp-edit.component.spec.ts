import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenceGrpEditComponent } from './expence-grp-edit.component';

describe('ExpenceGrpEditComponent', () => {
  let component: ExpenceGrpEditComponent;
  let fixture: ComponentFixture<ExpenceGrpEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenceGrpEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenceGrpEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
