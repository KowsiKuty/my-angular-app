import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionFileuploadComponent } from './connection-fileupload.component';

describe('ConnectionFileuploadComponent', () => {
  let component: ConnectionFileuploadComponent;
  let fixture: ComponentFixture<ConnectionFileuploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectionFileuploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionFileuploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
