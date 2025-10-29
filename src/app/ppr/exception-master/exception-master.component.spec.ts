import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExceptionMasterComponent } from './exception-master.component';

describe('ExceptionMasterComponent', () => {
  let component: ExceptionMasterComponent;
  let fixture: ComponentFixture<ExceptionMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExceptionMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExceptionMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
