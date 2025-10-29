import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandlordCreateComponent } from './landlord-create.component';

describe('LandlordCreateComponent', () => {
  let component: LandlordCreateComponent;
  let fixture: ComponentFixture<LandlordCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandlordCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandlordCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
