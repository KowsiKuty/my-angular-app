import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsAmcEditComponent } from './sms-amc-edit.component';

describe('SmsAmcEditComponent', () => {
  let component: SmsAmcEditComponent;
  let fixture: ComponentFixture<SmsAmcEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsAmcEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsAmcEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
