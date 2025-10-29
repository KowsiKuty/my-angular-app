import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskTemplateViewComponent } from './task-template-view.component';

describe('TaskTemplateViewComponent', () => {
  let component: TaskTemplateViewComponent;
  let fixture: ComponentFixture<TaskTemplateViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskTemplateViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskTemplateViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
