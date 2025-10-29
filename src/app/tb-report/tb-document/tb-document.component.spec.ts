import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TbDocumentComponent } from './tb-document.component';

describe('TbDocumentComponent', () => {
  let component: TbDocumentComponent;
  let fixture: ComponentFixture<TbDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TbDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TbDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
