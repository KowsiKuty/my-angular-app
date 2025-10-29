import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiseCreateComponent } from './premise-create.component';

describe('PremiseCreateComponent', () => {
  let component: PremiseCreateComponent;
  let fixture: ComponentFixture<PremiseCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PremiseCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PremiseCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
