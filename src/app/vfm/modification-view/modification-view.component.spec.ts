import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificationViewComponent } from './modification-view.component';

describe('ModificationViewComponent', () => {
  let component: ModificationViewComponent;
  let fixture: ComponentFixture<ModificationViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModificationViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
