import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TqQueryComponent } from './tq-query.component';

describe('TqQueryComponent', () => {
  let component: TqQueryComponent;
  let fixture: ComponentFixture<TqQueryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TqQueryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TqQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
