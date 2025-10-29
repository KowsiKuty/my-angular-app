import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MigrationHeaderComponent } from './migration-header.component';

describe('MigrationHeaderComponent', () => {
  let component: MigrationHeaderComponent;
  let fixture: ComponentFixture<MigrationHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MigrationHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MigrationHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
