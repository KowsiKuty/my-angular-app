import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadsuploadComponent } from './leadsupload.component';

describe('LeadsuploadComponent', () => {
  let component: LeadsuploadComponent;
  let fixture: ComponentFixture<LeadsuploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadsuploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadsuploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
