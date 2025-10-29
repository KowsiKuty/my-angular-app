import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KnockoffhistoryComponent } from './knockoffhistory.component';

describe('KnockoffhistoryComponent', () => {
  let component: KnockoffhistoryComponent;
  let fixture: ComponentFixture<KnockoffhistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KnockoffhistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KnockoffhistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
