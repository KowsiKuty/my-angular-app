import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrsmasterComponent } from './brsmaster.component';

describe('BrsmasterComponent', () => {
  let component: BrsmasterComponent;
  let fixture: ComponentFixture<BrsmasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrsmasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrsmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
