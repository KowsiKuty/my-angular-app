import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileuploadmasterCbdaComponent } from './fileuploadmaster-cbda.component';

describe('FileuploadmasterCbdaComponent', () => {
  let component: FileuploadmasterCbdaComponent;
  let fixture: ComponentFixture<FileuploadmasterCbdaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileuploadmasterCbdaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileuploadmasterCbdaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
