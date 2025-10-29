import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LcaComponent } from './lca.component';

describe('LcaComponent', () => {
  let component: LcaComponent;
  let fixture: ComponentFixture<LcaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LcaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LcaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
