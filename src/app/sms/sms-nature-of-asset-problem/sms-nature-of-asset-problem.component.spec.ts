import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsNatureOfAssetProblemComponent } from './sms-nature-of-asset-problem.component';

describe('SmsNatureOfAssetProblemComponent', () => {
  let component: SmsNatureOfAssetProblemComponent;
  let fixture: ComponentFixture<SmsNatureOfAssetProblemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsNatureOfAssetProblemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsNatureOfAssetProblemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
