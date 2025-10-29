import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EleTransactionComponent } from './ele-transaction.component';

describe('EleTransactionComponent', () => {
  let component: EleTransactionComponent;
  let fixture: ComponentFixture<EleTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EleTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EleTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
