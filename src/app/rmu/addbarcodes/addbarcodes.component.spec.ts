import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddbarcodesComponent } from './addbarcodes.component';

describe('AddbarcodesComponent', () => {
  let component: AddbarcodesComponent;
  let fixture: ComponentFixture<AddbarcodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddbarcodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddbarcodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
