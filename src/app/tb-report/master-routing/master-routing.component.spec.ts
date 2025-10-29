import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterRoutingComponent } from './master-routing.component';

describe('MasterRoutingComponent', () => {
  let component: MasterRoutingComponent;
  let fixture: ComponentFixture<MasterRoutingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterRoutingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterRoutingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
