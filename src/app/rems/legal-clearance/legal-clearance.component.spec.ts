import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalClearanceComponent } from './legal-clearance.component';

describe('LegalClearanceComponent', () => {
  let component: LegalClearanceComponent;
  let fixture: ComponentFixture<LegalClearanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LegalClearanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegalClearanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
