import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MappingMasterComponent } from './mapping-master.component';

describe('MappingMasterComponent', () => {
  let component: MappingMasterComponent;
  let fixture: ComponentFixture<MappingMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MappingMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MappingMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
