import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripmodificationComponent } from './tripmodification.component';

describe('TripmodificationComponent', () => {
  let component: TripmodificationComponent;
  let fixture: ComponentFixture<TripmodificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripmodificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripmodificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
