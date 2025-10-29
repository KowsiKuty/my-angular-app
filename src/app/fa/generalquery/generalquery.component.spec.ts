import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralqueryComponent } from './generalquery.component';

describe('GeneralqueryComponent', () => {
  let component: GeneralqueryComponent;
  let fixture: ComponentFixture<GeneralqueryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralqueryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralqueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
