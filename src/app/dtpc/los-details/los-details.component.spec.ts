import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LosDetailsComponent } from './los-details.component';

describe('LosDetailsComponent', () => {
  let component: LosDetailsComponent;
  let fixture: ComponentFixture<LosDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LosDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LosDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
