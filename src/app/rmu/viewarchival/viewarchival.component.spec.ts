import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewarchivalComponent } from './viewarchival.component';

describe('ViewarchivalComponent', () => {
  let component: ViewarchivalComponent;
  let fixture: ComponentFixture<ViewarchivalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewarchivalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewarchivalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
