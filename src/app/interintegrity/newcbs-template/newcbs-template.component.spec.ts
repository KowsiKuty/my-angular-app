import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewcbsTemplateComponent } from './newcbs-template.component';

describe('NewcbsTemplateComponent', () => {
  let component: NewcbsTemplateComponent;
  let fixture: ComponentFixture<NewcbsTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewcbsTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewcbsTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
