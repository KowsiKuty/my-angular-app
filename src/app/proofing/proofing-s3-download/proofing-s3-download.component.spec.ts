import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProofingS3DownloadComponent } from './proofing-s3-download.component';

describe('ProofingS3DownloadComponent', () => {
  let component: ProofingS3DownloadComponent;
  let fixture: ComponentFixture<ProofingS3DownloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProofingS3DownloadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProofingS3DownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
