import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnedArrearsFormComponent } from './owned-arrears-form.component';

describe('OwnedArrearsFormComponent', () => {
  let component: OwnedArrearsFormComponent;
  let fixture: ComponentFixture<OwnedArrearsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnedArrearsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnedArrearsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
