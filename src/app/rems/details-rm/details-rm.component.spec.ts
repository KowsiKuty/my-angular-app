import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsRMComponent } from './details-rm.component';

describe('DetailsRMComponent', () => {
  let component: DetailsRMComponent;
  let fixture: ComponentFixture<DetailsRMComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsRMComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsRMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
