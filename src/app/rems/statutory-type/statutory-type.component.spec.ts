import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatutoryTypeComponent } from './statutory-type.component';

describe('StatutoryTypeComponent', () => {
  let component: StatutoryTypeComponent;
  let fixture: ComponentFixture<StatutoryTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatutoryTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatutoryTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
