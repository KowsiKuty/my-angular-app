import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BreToEcfViewComponent } from './bre-to-ecf-view.component';

describe('BreToEcfViewComponent', () => {
  let component: BreToEcfViewComponent;
  let fixture: ComponentFixture<BreToEcfViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BreToEcfViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreToEcfViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
