import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntertransactionsComponent } from './intertransactions.component';

describe('IntertransactionsComponent', () => {
  let component: IntertransactionsComponent;
  let fixture: ComponentFixture<IntertransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntertransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntertransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
