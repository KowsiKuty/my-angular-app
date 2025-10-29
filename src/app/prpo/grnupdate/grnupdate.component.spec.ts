import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrnupdateComponent } from './grnupdate.component';

describe('GrnupdateComponent', () => {
  let component: GrnupdateComponent;
  let fixture: ComponentFixture<GrnupdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrnupdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrnupdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
