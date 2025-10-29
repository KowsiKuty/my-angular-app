import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EcfbatchViewComponent } from './ecfbatch-view.component';

describe('EcfbatchViewComponent', () => {
  let component: EcfbatchViewComponent;
  let fixture: ComponentFixture<EcfbatchViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EcfbatchViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcfbatchViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
