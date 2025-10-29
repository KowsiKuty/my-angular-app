import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurgehistoryComponent } from './purgehistory.component';

describe('PurgehistoryComponent', () => {
  let component: PurgehistoryComponent;
  let fixture: ComponentFixture<PurgehistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurgehistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurgehistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
