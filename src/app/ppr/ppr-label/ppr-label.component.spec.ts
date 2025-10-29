import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PprLabelComponent } from './ppr-label.component';

describe('PprLabelComponent', () => {
  let component: PprLabelComponent;
  let fixture: ComponentFixture<PprLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PprLabelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PprLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
