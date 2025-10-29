import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconexternalComponent } from './reconexternal.component';

describe('ReconexternalComponent', () => {
  let component: ReconexternalComponent;
  let fixture: ComponentFixture<ReconexternalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReconexternalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReconexternalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


