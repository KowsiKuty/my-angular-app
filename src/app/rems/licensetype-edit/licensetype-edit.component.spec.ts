import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LicensetypeEditComponent } from './licensetype-edit.component';

describe('LicensetypeEditComponent', () => {
  let component: LicensetypeEditComponent;
  let fixture: ComponentFixture<LicensetypeEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LicensetypeEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LicensetypeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
 