import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsAmcCreateComponent } from './sms-amc-create.component';

describe('SmsAmcCreateComponent', () => {
  let component: SmsAmcCreateComponent;
  let fixture: ComponentFixture<SmsAmcCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsAmcCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsAmcCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
