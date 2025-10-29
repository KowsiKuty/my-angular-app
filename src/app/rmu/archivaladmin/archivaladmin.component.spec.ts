import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivaladminComponent } from './archivaladmin.component';

describe('ArchivaladminComponent', () => {
  let component: ArchivaladminComponent;
  let fixture: ComponentFixture<ArchivaladminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchivaladminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivaladminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
