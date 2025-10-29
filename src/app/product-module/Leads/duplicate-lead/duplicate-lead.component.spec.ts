import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicateLeadComponent } from './duplicate-lead.component';

describe('DuplicateLeadComponent', () => {
  let component: DuplicateLeadComponent;
  let fixture: ComponentFixture<DuplicateLeadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DuplicateLeadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DuplicateLeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
