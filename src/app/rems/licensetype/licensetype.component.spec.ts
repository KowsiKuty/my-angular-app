import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LicensetypeComponent } from './licensetype.component';

describe('LicensetypeComponent', () => {
  let component: LicensetypeComponent;
  let fixture: ComponentFixture<LicensetypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LicensetypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LicensetypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
 