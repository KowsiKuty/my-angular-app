import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAppDetailsComponent } from './dialog-app-details.component';

describe('DialogAppDetailsComponent', () => {
  let component: DialogAppDetailsComponent;
  let fixture: ComponentFixture<DialogAppDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogAppDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAppDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
