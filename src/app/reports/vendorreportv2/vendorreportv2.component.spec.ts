import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Vendorreportv2Component } from './vendorreportv2.component';

describe('Vendorreportv2Component', () => {
  let component: Vendorreportv2Component;
  let fixture: ComponentFixture<Vendorreportv2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Vendorreportv2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Vendorreportv2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});