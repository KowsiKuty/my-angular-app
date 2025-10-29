import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AwsFileComponent } from './aws-file.component';

describe('AwsFileComponent', () => {
  let component: AwsFileComponent;
  let fixture: ComponentFixture<AwsFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AwsFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AwsFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
