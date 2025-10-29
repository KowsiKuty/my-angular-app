import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoknockoffComponent } from './autoknockoff.component';

describe('AutoknockoffComponent', () => {
  let component: AutoknockoffComponent;
  let fixture: ComponentFixture<AutoknockoffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoknockoffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoknockoffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
