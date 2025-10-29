import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewbrsformComponent } from './newbrsform.component';

describe('NewbrsformComponent', () => {
  let component: NewbrsformComponent;
  let fixture: ComponentFixture<NewbrsformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewbrsformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewbrsformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
