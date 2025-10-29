import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialproductCbdaComponent } from './specialproduct-cbda.component';

describe('SpecialproductCbdaComponent', () => {
  let component: SpecialproductCbdaComponent;
  let fixture: ComponentFixture<SpecialproductCbdaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialproductCbdaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialproductCbdaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
