import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaisereqViewComponent } from './raisereq-view.component';

describe('RaisereqViewComponent', () => {
  let component: RaisereqViewComponent;
  let fixture: ComponentFixture<RaisereqViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaisereqViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaisereqViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
