import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MinwagesmasterComponent } from './minwagesmaster.component';

describe('MinwagesmasterComponent', () => {
  let component: MinwagesmasterComponent;
  let fixture: ComponentFixture<MinwagesmasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MinwagesmasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinwagesmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
