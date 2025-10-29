import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupformComponent } from './groupform.component';

describe('GroupformComponent', () => {
  let component: GroupformComponent;
  let fixture: ComponentFixture<GroupformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
