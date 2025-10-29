import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadsdatapageComponent } from './leadsdatapage.component';

describe('LeadsdatapageComponent', () => {
  let component: LeadsdatapageComponent;
  let fixture: ComponentFixture<LeadsdatapageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadsdatapageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadsdatapageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
