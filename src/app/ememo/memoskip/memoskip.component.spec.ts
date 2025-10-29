import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemoskipComponent } from './memoskip.component';

describe('MemoskipComponent', () => {
  let component: MemoskipComponent;
  let fixture: ComponentFixture<MemoskipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemoskipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemoskipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
