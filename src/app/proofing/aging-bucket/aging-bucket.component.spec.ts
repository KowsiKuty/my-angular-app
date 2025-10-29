import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgingBucketComponent } from './aging-bucket.component';

describe('AgingBucketComponent', () => {
  let component: AgingBucketComponent;
  let fixture: ComponentFixture<AgingBucketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgingBucketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgingBucketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
