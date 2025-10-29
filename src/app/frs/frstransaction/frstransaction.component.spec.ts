import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrstransactionComponent } from './frstransaction.component';

describe('FrstransactionComponent', () => {
  let component: FrstransactionComponent;
  let fixture: ComponentFixture<FrstransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrstransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrstransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
