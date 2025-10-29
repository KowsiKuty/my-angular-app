import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEleDetailComponent } from './view-ele-detail.component';

describe('ViewEleDetailComponent', () => {
  let component: ViewEleDetailComponent;
  let fixture: ComponentFixture<ViewEleDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewEleDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEleDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
