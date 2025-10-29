import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLosComponent } from './create-los.component';

describe('CreateLosComponent', () => {
  let component: CreateLosComponent;
  let fixture: ComponentFixture<CreateLosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateLosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
