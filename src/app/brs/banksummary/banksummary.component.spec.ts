import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BanksummaryComponent } from './banksummary.component';

describe('BanksummaryComponent', () => {
  let component: BanksummaryComponent;
  let fixture: ComponentFixture<BanksummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BanksummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BanksummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
