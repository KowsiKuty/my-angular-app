import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { FileuploadmasterCbdaComponent } from "./fileuploadmaster-cbda/fileuploadmaster-cbda.component";
import { IncusemasterCbdaComponent } from "./incusemaster-cbda/incusemaster-cbda.component";
import { MappingmasterCbdaComponent } from "./mappingmaster-cbda/mappingmaster-cbda.component";
import { SpecialproductCbdaComponent } from "./specialproduct-cbda/specialproduct-cbda.component";
import { CanActivateGuardService } from "../can-activate-guard.service";
import { CbdamainComponent } from "./cbdamain/cbdamain.component";

const routes: Routes = [
  {
    path: "",
    canActivate: [CanActivateGuardService],
    children: [
      { path: "maincbda", component: CbdamainComponent },
      { path: "fileupload", component: FileuploadmasterCbdaComponent },
      { path: "includecbda", component: IncusemasterCbdaComponent },
      { path: "mappingcbda", component: MappingmasterCbdaComponent },
      { path: "specialproduct", component: SpecialproductCbdaComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CbdareportRoutingModule {}
