import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DssdocumentComponent } from './dssdocument.component';

describe('DssdocumentComponent', () => {
  let component: DssdocumentComponent;
  let fixture: ComponentFixture<DssdocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DssdocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DssdocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
