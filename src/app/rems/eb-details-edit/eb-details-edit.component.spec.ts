import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EbDetailsEditComponent } from './eb-details-edit.component';

describe('EbDetailsEditComponent', () => {
  let component: EbDetailsEditComponent;
  let fixture: ComponentFixture<EbDetailsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EbDetailsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EbDetailsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
