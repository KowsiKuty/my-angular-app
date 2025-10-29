import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesSelectionComponent } from './files-selection.component';

describe('FilesSelectionComponent', () => {
  let component: FilesSelectionComponent;
  let fixture: ComponentFixture<FilesSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilesSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilesSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
