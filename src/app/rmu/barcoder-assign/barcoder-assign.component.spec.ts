import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarcoderAssignComponent } from './barcoder-assign.component';

describe('BarcoderAssignComponent', () => {
  let component: BarcoderAssignComponent;
  let fixture: ComponentFixture<BarcoderAssignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarcoderAssignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarcoderAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
