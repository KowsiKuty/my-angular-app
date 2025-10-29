import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrstransactionsComponent } from './brstransactions.component';

describe('BrstransactionsComponent', () => {
  let component: BrstransactionsComponent;
  let fixture: ComponentFixture<BrstransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrstransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrstransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
