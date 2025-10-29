import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CbdatransactionComponent } from './cbdatransaction.component';

describe('CbdatransactionComponent', () => {
  let component: CbdatransactionComponent;
  let fixture: ComponentFixture<CbdatransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CbdatransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CbdatransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
