import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoarunscreenComponent } from './roarunscreen.component';

describe('RoarunscreenComponent', () => {
  let component: RoarunscreenComponent;
  let fixture: ComponentFixture<RoarunscreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoarunscreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoarunscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
