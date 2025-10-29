import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JwUploadComponent } from './jw-upload.component';

describe('JwUploadComponent', () => {
  let component: JwUploadComponent;
  let fixture: ComponentFixture<JwUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JwUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JwUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
