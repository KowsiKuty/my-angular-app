import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateApComponent } from './create-ap.component';

describe('CreateApComponent', () => {
  let component: CreateApComponent;
  let fixture: ComponentFixture<CreateApComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateApComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateApComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
