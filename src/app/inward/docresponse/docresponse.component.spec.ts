import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocresponseComponent } from './docresponse.component';

describe('DocresponseComponent', () => {
  let component: DocresponseComponent;
  let fixture: ComponentFixture<DocresponseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocresponseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocresponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
