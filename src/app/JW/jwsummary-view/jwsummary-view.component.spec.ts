import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JwsummaryViewComponent } from './jwsummary-view.component';

describe('JwsummaryViewComponent', () => {
  let component: JwsummaryViewComponent;
  let fixture: ComponentFixture<JwsummaryViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JwsummaryViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JwsummaryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
