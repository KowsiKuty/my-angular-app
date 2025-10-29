import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LcaCreationComponent } from './lca-creation.component';

describe('LcaCreationComponent', () => {
  let component: LcaCreationComponent;
  let fixture: ComponentFixture<LcaCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LcaCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LcaCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
