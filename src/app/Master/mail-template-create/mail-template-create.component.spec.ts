import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailTemplateCreateComponent } from './mail-template-create.component';

describe('MailTemplateCreateComponent', () => {
  let component: MailTemplateCreateComponent;
  let fixture: ComponentFixture<MailTemplateCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailTemplateCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailTemplateCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
