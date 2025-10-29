import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RulemappingComponent } from './rulemapping.component';

describe('RulemappingComponent', () => {
  let component: RulemappingComponent;
  let fixture: ComponentFixture<RulemappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RulemappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RulemappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
