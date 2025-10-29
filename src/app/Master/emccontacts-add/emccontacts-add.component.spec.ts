import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmccontactsAddComponent } from './emccontacts-add.component';

describe('EmccontactsAddComponent', () => {
  let component: EmccontactsAddComponent;
  let fixture: ComponentFixture<EmccontactsAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmccontactsAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmccontactsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
