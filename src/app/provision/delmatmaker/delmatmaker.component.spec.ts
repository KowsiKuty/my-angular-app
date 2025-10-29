import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DelmatmakerComponent } from './delmatmaker.component';

describe('DelmatmakerComponent', () => {
  let component: DelmatmakerComponent;
  let fixture: ComponentFixture<DelmatmakerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DelmatmakerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DelmatmakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
