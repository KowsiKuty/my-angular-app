import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewtemplatecreateComponent } from './newtemplatecreate.component';

describe('NewtemplatecreateComponent', () => {
  let component: NewtemplatecreateComponent;
  let fixture: ComponentFixture<NewtemplatecreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewtemplatecreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewtemplatecreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
