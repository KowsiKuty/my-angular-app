import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemstemplateComponent } from './remstemplate.component';

describe('RemstemplateComponent', () => {
  let component: RemstemplateComponent;
  let fixture: ComponentFixture<RemstemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemstemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemstemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
