import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRaiserequestComponent } from './add-raiserequest.component';

describe('AddRaiserequestComponent', () => {
  let component: AddRaiserequestComponent;
  let fixture: ComponentFixture<AddRaiserequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRaiserequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRaiserequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
