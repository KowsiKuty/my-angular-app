import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EcfapViewComponent } from './ecfap-view.component';

describe('EcfapViewComponent', () => {
  let component: EcfapViewComponent;
  let fixture: ComponentFixture<EcfapViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EcfapViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcfapViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
