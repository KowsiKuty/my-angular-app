import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemoreportComponent } from './memoreport.component';

describe('MemoreportComponent', () => {
  let component: MemoreportComponent;
  let fixture: ComponentFixture<MemoreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemoreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemoreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
