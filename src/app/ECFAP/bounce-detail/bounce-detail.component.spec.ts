import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BounceDetailComponent } from './bounce-detail.component';

describe('BounceDetailComponent', () => {
  let component: BounceDetailComponent;
  let fixture: ComponentFixture<BounceDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BounceDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BounceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
