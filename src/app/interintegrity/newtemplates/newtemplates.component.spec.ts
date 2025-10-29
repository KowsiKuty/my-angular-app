import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewtemplatesComponent } from './newtemplates.component';

describe('NewtemplatesComponent', () => {
  let component: NewtemplatesComponent;
  let fixture: ComponentFixture<NewtemplatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewtemplatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewtemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
