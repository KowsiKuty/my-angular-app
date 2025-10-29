import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RentTermFormComponent } from './rent-term-form.component';

describe('RentTermFormComponent', () => {
  let component: RentTermFormComponent;
  let fixture: ComponentFixture<RentTermFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentTermFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentTermFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
