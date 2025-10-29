import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewsinglerecordComponent } from './viewsinglerecord.component';

describe('ViewsinglerecordComponent', () => {
  let component: ViewsinglerecordComponent;
  let fixture: ComponentFixture<ViewsinglerecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewsinglerecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewsinglerecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
