import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JwComponent } from './jw.component';

describe('JwComponent', () => {
  let component: JwComponent;
  let fixture: ComponentFixture<JwComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JwComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JwComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
