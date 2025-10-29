import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewbrsrulesetsComponent } from './newbrsrulesets.component';

describe('NewbrsrulesetsComponent', () => {
  let component: NewbrsrulesetsComponent;
  let fixture: ComponentFixture<NewbrsrulesetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewbrsrulesetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewbrsrulesetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
