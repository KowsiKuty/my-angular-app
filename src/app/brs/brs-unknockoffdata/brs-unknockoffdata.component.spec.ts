import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrsUnknockoffdataComponent } from './brs-unknockoffdata.component';

describe('BrsUnknockoffdataComponent', () => {
  let component: BrsUnknockoffdataComponent;
  let fixture: ComponentFixture<BrsUnknockoffdataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrsUnknockoffdataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrsUnknockoffdataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
