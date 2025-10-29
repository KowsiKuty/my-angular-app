import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DestroyapproveComponent } from './destroyapprove.component';

describe('DestroyapproveComponent', () => {
  let component: DestroyapproveComponent;
  let fixture: ComponentFixture<DestroyapproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DestroyapproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DestroyapproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
