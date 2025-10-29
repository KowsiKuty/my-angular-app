import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewrightscreateComponent } from './viewrightscreate.component';

describe('ViewrightscreateComponent', () => {
  let component: ViewrightscreateComponent;
  let fixture: ComponentFixture<ViewrightscreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewrightscreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewrightscreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
