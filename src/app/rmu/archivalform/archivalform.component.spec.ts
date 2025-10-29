import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivalformComponent } from './archivalform.component';

describe('ArchivalformComponent', () => {
  let component: ArchivalformComponent;
  let fixture: ComponentFixture<ArchivalformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchivalformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivalformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
