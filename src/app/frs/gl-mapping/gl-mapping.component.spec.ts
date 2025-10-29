import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlMappingComponent } from './gl-mapping.component';

describe('GlMappingComponent', () => {
  let component: GlMappingComponent;
  let fixture: ComponentFixture<GlMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
