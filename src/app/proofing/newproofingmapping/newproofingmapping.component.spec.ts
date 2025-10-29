import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewproofingmappingComponent } from './newproofingmapping.component';

describe('NewproofingmappingComponent', () => {
  let component: NewproofingmappingComponent;
  let fixture: ComponentFixture<NewproofingmappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewproofingmappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewproofingmappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
