import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProofingMasterComponent } from './proofing-master/proofing-master.component';
import { ProofingMapComponent } from './proofing-map/proofing-map.component';
import { TemplateCreateComponent } from './template-create/template-create.component';
import { ProofingUploadComponent } from './proofing-upload/proofing-upload.component'
import { CreateAccountComponent } from './create-account/create-account.component';
// import { CreateAccountComponent } from '../create-account/create-account.component';
import { CanActivateGuardService } from '../can-activate-guard.service';
import { AgingReportComponent } from './aging-report/aging-report.component';
import { AgingBucketComponent } from './aging-bucket/aging-bucket.component';
import { HistoryComponent } from './history/history.component';
import { ProofingTransactionComponent } from './proofing-transaction/proofing-transaction.component';
import { ProofingreportComponent } from './proofingreport/proofingreport.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { FileUploadSummaryComponent } from './file-upload-summary/file-upload-summary.component';
import { ProofingS3DownloadComponent } from './proofing-s3-download/proofing-s3-download.component';
import { ConnectionFileuploadComponent } from './connection-fileupload/connection-fileupload.component'
import { NewproofingComponent } from './newproofing/newproofing.component';
import { NewproofinguploadComponent } from './newproofingupload/newproofingupload.component';
import { NewproofingmappingComponent } from './newproofingmapping/newproofingmapping.component';
import { NewconnectionfileComponent } from './newconnectionfile/newconnectionfile.component';

// "/proofingmap"
const routes: Routes = [
  {
    path: '', canActivate: [CanActivateGuardService],
    children: [
      { path: 'ProofingMaster', component: ProofingMasterComponent },
      { path: 'ProofingMap', component: ProofingMapComponent },
      { path: 'proofingmap', component: ProofingMapComponent },
      { path: 'templateadd', component: TemplateCreateComponent },
      { path: 'ProofingUpload', component: ProofingUploadComponent },
      { path: 'proofingupload', component: ProofingUploadComponent },
      { path: 'accountcreate', component: CreateAccountComponent },
      // { path:'accountedit',component:CreateAccountComponent},
      { path: 'ar', component: AgingReportComponent },
      { path: 'aging', component: AgingBucketComponent },
      { path: 'history', component: HistoryComponent},
      {path:'proofingtransaction',component:ProofingTransactionComponent},
      {path:'proofingreport',component:FileUploadSummaryComponent},
      {path:'fileupload',component:FileUploadSummaryComponent},
      {path: 's3download', component: ProofingS3DownloadComponent},
      {path: 'connection_fileupload', component: ConnectionFileuploadComponent},
      {path: 'newproffing', component: NewproofingComponent},
      {path: 'newproffingupload', component: NewproofinguploadComponent},
      {path: 'newproofingmapping', component: NewproofingmappingComponent},
      {path: 'newconnectionfile', component: NewconnectionfileComponent},

      // {path:'proofingreport',component:FileUploadComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProofingRoutingModule { }
