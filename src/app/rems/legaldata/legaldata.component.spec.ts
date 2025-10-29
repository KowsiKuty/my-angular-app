import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LegaldataComponent } from './legaldata.component';

describe('LegaldataComponent', () => {
  let component: LegaldataComponent;
  let fixture: ComponentFixture<LegaldataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LegaldataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegaldataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
