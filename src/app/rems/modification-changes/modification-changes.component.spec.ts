import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificationChangesComponent } from './modification-changes.component';

describe('ModificationChangesComponent', () => {
  let component: ModificationChangesComponent;
  let fixture: ComponentFixture<ModificationChangesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModificationChangesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificationChangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
