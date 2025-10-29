import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsWarrantyCreateComponent } from './sms-warranty-create.component';

describe('SmsWarrantyCreateComponent', () => {
  let component: SmsWarrantyCreateComponent;
  let fixture: ComponentFixture<SmsWarrantyCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsWarrantyCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsWarrantyCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
