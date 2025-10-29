import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsMasterComponent } from './sms-master.component';

describe('SmsMasterComponent', () => {
  let component: SmsMasterComponent;
  let fixture: ComponentFixture<SmsMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
