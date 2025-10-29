import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchrequestMakerComponent } from './branchrequest-maker.component';

describe('BranchrequestMakerComponent', () => {
  let component: BranchrequestMakerComponent;
  let fixture: ComponentFixture<BranchrequestMakerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchrequestMakerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchrequestMakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
