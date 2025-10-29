import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiseViewComponent } from './premise-view.component';

describe('PremiseViewComponent', () => {
  let component: PremiseViewComponent;
  let fixture: ComponentFixture<PremiseViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PremiseViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PremiseViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
