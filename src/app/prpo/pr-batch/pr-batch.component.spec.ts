import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrBatchComponent } from './pr-batch.component';

describe('PrBatchComponent', () => {
  let component: PrBatchComponent;
  let fixture: ComponentFixture<PrBatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrBatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
