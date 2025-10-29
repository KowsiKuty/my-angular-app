import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RcsaMainComponent } from './rcsa-main.component';

describe('RcsaMainComponent', () => {
  let component: RcsaMainComponent;
  let fixture: ComponentFixture<RcsaMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RcsaMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RcsaMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
