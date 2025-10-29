import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewconnectionfileComponent } from './newconnectionfile.component';

describe('NewconnectionfileComponent', () => {
  let component: NewconnectionfileComponent;
  let fixture: ComponentFixture<NewconnectionfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewconnectionfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewconnectionfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
