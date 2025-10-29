import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemsanalysisComponent } from './remsanalysis.component';

describe('RemsanalysisComponent', () => {
  let component: RemsanalysisComponent;
  let fixture: ComponentFixture<RemsanalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemsanalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemsanalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
