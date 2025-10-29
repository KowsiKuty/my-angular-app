import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploadSummaryComponent } from './file-upload-summary.component';

describe('FileUploadSummaryComponent', () => {
  let component: FileUploadSummaryComponent;
  let fixture: ComponentFixture<FileUploadSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileUploadSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploadSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
