import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NwisefinsummComponent } from './nwisefinsumm.component';

describe('NwisefinsummComponent', () => {
  let component: NwisefinsummComponent;
  let fixture: ComponentFixture<NwisefinsummComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NwisefinsummComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NwisefinsummComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
