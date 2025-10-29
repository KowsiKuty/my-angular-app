import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CbdamainComponent } from './cbdamain.component';

describe('CbdamainComponent', () => {
  let component: CbdamainComponent;
  let fixture: ComponentFixture<CbdamainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CbdamainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CbdamainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
