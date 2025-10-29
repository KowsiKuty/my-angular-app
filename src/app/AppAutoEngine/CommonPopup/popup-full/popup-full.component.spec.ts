import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupFullComponent } from './popup-full.component';

describe('PopupFullComponent', () => {
  let component: PopupFullComponent;
  let fixture: ComponentFixture<PopupFullComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupFullComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupFullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
