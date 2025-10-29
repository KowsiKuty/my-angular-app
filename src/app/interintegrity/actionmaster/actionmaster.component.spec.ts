import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionmasterComponent } from './actionmaster.component';

describe('ActionmasterComponent', () => {
  let component: ActionmasterComponent;
  let fixture: ComponentFixture<ActionmasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionmasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
