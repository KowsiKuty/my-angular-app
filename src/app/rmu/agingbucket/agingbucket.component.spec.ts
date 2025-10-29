import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgingbucketComponent } from './agingbucket.component';

describe('AgingbucketComponent', () => {
  let component: AgingbucketComponent;
  let fixture: ComponentFixture<AgingbucketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgingbucketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgingbucketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
