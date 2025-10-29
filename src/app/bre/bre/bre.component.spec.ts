import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BreComponent } from './bre.component';

describe('BreComponent', () => {
  let component: BreComponent;
  let fixture: ComponentFixture<BreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
