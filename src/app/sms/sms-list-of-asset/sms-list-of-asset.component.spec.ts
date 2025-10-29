import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsListOfAssetComponent } from './sms-list-of-asset.component';

describe('SmsListOfAssetComponent', () => {
  let component: SmsListOfAssetComponent;
  let fixture: ComponentFixture<SmsListOfAssetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsListOfAssetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsListOfAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
