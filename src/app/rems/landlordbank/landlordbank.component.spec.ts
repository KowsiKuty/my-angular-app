import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandlordbankComponent } from './landlordbank.component';

describe('LandlordbankComponent', () => {
  let component: LandlordbankComponent;
  let fixture: ComponentFixture<LandlordbankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandlordbankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandlordbankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
