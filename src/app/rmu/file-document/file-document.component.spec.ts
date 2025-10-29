import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileDocumentComponent } from './file-document.component';

describe('FileDocumentComponent', () => {
  let component: FileDocumentComponent;
  let fixture: ComponentFixture<FileDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
