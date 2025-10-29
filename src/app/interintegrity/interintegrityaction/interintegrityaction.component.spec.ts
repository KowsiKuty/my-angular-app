import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterintegrityactionComponent } from './interintegrityaction.component';

describe('InterintegrityactionComponent', () => {
  let component: InterintegrityactionComponent;
  let fixture: ComponentFixture<InterintegrityactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterintegrityactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterintegrityactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
