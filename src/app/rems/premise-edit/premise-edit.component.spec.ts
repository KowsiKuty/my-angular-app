import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiseEditComponent } from './premise-edit.component';

describe('PremiseEditComponent', () => {
  let component: PremiseEditComponent;
  let fixture: ComponentFixture<PremiseEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PremiseEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PremiseEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
