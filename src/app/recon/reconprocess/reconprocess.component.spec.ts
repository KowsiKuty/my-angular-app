import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconprocessComponent } from './reconprocess.component';

describe('ReconprocessComponent', () => {
  let component: ReconprocessComponent;
  let fixture: ComponentFixture<ReconprocessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReconprocessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReconprocessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
