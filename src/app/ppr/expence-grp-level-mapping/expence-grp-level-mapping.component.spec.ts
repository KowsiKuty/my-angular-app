import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenceGrpLevelMappingComponent } from './expence-grp-level-mapping.component';

describe('ExpenceGrpLevelMappingComponent', () => {
  let component: ExpenceGrpLevelMappingComponent;
  let fixture: ComponentFixture<ExpenceGrpLevelMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenceGrpLevelMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenceGrpLevelMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
