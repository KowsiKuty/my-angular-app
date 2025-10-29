import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CbdaSubComponent } from './cbda-sub.component';

describe('CbdaSubComponent', () => {
  let component: CbdaSubComponent;
  let fixture: ComponentFixture<CbdaSubComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CbdaSubComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CbdaSubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
