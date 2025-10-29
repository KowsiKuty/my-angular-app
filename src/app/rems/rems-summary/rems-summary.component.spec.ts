import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemsSummaryComponent } from './rems-summary.component';

describe('RemsSummaryComponent', () => {
  let component: RemsSummaryComponent;
  let fixture: ComponentFixture<RemsSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemsSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
