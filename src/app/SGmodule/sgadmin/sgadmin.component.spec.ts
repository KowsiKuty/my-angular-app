import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SGAdminComponent } from './sgadmin.component';

describe('SGAdminComponent', () => {
  let component: SGAdminComponent;
  let fixture: ComponentFixture<SGAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SGAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SGAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
