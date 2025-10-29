import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TbSubmoduleRoutingComponent } from './tb-submodule-routing.component';

describe('TbSubmoduleRoutingComponent', () => {
  let component: TbSubmoduleRoutingComponent;
  let fixture: ComponentFixture<TbSubmoduleRoutingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TbSubmoduleRoutingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TbSubmoduleRoutingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
