import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryexefileComponent } from './queryexefile.component';

describe('QueryexefileComponent', () => {
  let component: QueryexefileComponent;
  let fixture: ComponentFixture<QueryexefileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueryexefileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryexefileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
