import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatutoryFormComponent } from './statutory-form.component';

describe('StatutoryFormComponent', () => {
  let component: StatutoryFormComponent;
  let fixture: ComponentFixture<StatutoryFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatutoryFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatutoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
