import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivalmasterComponent } from './archivalmaster.component';

describe('ArchivalmasterComponent', () => {
  let component: ArchivalmasterComponent;
  let fixture: ComponentFixture<ArchivalmasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchivalmasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivalmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
