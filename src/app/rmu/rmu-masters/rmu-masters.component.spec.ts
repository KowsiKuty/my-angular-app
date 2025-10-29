import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RmuMastersComponent } from './rmu-masters.component';

describe('RmuMastersComponent', () => {
  let component: RmuMastersComponent;
  let fixture: ComponentFixture<RmuMastersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RmuMastersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RmuMastersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
