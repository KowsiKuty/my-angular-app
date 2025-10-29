import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LcaViewComponent } from './lca-view.component';

describe('LcaViewComponent', () => {
  let component: LcaViewComponent;
  let fixture: ComponentFixture<LcaViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LcaViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LcaViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
