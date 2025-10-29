import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CanActivateGuardService } from "../can-activate-guard.service";
import { AssetDetailsComponentComponent } from "./asset-details-component/asset-details-component.component";

const routes:Routes=[
    {
        path: "",
        canActivate: [CanActivateGuardService],
        children: [
          { path: "AssetDetail", component:AssetDetailsComponentComponent}
        ],
      },
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssetDetailsReportRoutingModule {}