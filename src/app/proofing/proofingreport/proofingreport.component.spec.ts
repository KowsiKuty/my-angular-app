import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProofingreportComponent } from './proofingreport.component';

describe('ProofingreportComponent', () => {
  let component: ProofingreportComponent;
  let fixture: ComponentFixture<ProofingreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProofingreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProofingreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
