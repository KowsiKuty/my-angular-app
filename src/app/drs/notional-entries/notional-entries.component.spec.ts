import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotionalEntriesComponent } from './notional-entries.component';

describe('NotionalEntriesComponent', () => {
  let component: NotionalEntriesComponent;
  let fixture: ComponentFixture<NotionalEntriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotionalEntriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotionalEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
