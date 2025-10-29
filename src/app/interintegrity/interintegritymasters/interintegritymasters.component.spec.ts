import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterintegritymastersComponent } from './interintegritymasters.component';

describe('InterintegritymastersComponent', () => {
  let component: InterintegritymastersComponent;
  let fixture: ComponentFixture<InterintegritymastersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterintegritymastersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterintegritymastersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
