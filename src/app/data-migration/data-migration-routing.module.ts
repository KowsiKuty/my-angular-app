import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CanActivateGuardService } from "../can-activate-guard.service";
import { MigrationHeaderComponent } from "./migration-header/migration-header.component";
import { MigrationMainComponent } from "./migration-main/migration-main.component";

const routes:Routes=[
    {
        path: "",
        canActivate: [CanActivateGuardService],
        children: [
          { path: "MigrateHead", component: MigrationHeaderComponent },
          { path: "MigrateMain", component: MigrationMainComponent }
        ],
      },
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataMigrationRoutingModule {}