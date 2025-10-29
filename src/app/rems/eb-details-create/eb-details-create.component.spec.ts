import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EbDetailsCreateComponent } from './eb-details-create.component';

describe('EbDetailsCreateComponent', () => {
  let component: EbDetailsCreateComponent;
  let fixture: ComponentFixture<EbDetailsCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EbDetailsCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EbDetailsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
