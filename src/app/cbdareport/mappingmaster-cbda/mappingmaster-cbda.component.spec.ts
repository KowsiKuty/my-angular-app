import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MappingmasterCbdaComponent } from './mappingmaster-cbda.component';

describe('MappingmasterCbdaComponent', () => {
  let component: MappingmasterCbdaComponent;
  let fixture: ComponentFixture<MappingmasterCbdaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MappingmasterCbdaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MappingmasterCbdaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
