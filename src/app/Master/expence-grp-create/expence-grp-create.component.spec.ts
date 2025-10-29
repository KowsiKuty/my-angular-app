import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenceGrpCreateComponent } from './expence-grp-create.component';

describe('ExpenceGrpCreateComponent', () => {
  let component: ExpenceGrpCreateComponent;
  let fixture: ComponentFixture<ExpenceGrpCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenceGrpCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenceGrpCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
