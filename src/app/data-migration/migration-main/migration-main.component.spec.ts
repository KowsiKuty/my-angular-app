import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MigrationMainComponent } from './migration-main.component';

describe('MigrationMainComponent', () => {
  let component: MigrationMainComponent;
  let fixture: ComponentFixture<MigrationMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MigrationMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MigrationMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
