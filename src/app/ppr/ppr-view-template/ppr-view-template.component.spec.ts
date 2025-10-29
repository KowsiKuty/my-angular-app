import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PprViewTemplateComponent } from './ppr-view-template.component';

describe('PprViewTemplateComponent', () => {
  let component: PprViewTemplateComponent;
  let fixture: ComponentFixture<PprViewTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PprViewTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PprViewTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
