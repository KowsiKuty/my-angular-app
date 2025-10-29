import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewproofinguploadComponent } from './newproofingupload.component';

describe('NewproofinguploadComponent', () => {
  let component: NewproofinguploadComponent;
  let fixture: ComponentFixture<NewproofinguploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewproofinguploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewproofinguploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
