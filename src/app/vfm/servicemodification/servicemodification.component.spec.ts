import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicemodificationComponent } from './servicemodification.component';

describe('ServicemodificationComponent', () => {
  let component: ServicemodificationComponent;
  let fixture: ComponentFixture<ServicemodificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicemodificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicemodificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
