import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrsdocumentComponent } from './drsdocument.component';

describe('DrsdocumentComponent', () => {
  let component: DrsdocumentComponent;
  let fixture: ComponentFixture<DrsdocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrsdocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrsdocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
