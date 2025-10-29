import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import {  SharedService} from 'src/app/service/shared.service'

const isSkipLocationChange = environment.isSkipLocationChange

@Component({
  selector: 'app-fa-transaction-summary',
  templateUrl: './fa-transaction-summary.component.html',
  styleUrls: ['./fa-transaction-summary.component.scss']
})
export class FaTransactionSummaryComponent implements OnInit {
//   listicons:any={139:"fa fa-newspaper-o",153:"fa fa-chain-broken",154:"fa fa-creative-commons",141:"fa fa-calendar",
//   163:"fa fa-newspaper-o",170:"fa fa-pencil-square-o",159:"fa fa-cc-diners-club",160:"fa fa-cc-diners-club",140:"fa fa-calendar",
//   174:"fa fa-columns",145:"fa fa-compress",173:'fa fa-code-fork',164:"fa fa-calendar-check-o",171:"fa fa-pencil-square-o",
//   172:"fa fa-fire",165:"fa fa-exchange",166:"fa fa-pie-chart",167:"fa fa-cog",168:"fa fa-gg",169:"fa fa-balance-scale",
//   157:"fa fa-cog",161:"fa fa-users",162:"fa fa-users",158:"fa fa-quora",179:"fa fa-columns",143:"fa fa-balance-scale",142:"fa fa-random",144:"fa fa-snowflake-o",
//   146:"fa fa-cc-diners-club",178:"fa fa-fire",185:'fa fa-code-fork',233:'fa fa-code-fork'
// };
listicons:any={"Asset Maker Summary":"fa fa-newspaper-o","Value Change Maker Summary":"fa fa-chain-broken","Value Change Checker Summary":"fa fa-creative-commons","Cp date Change maker summary":"fa fa-calendar",
"Asset Checker Summary":"fa fa-newspaper-o","Write off Maker Summary":"fa fa-pencil-square-o","Club Summary":"fa fa-cc-diners-club","Club Checker":"fa fa-cc-diners-club",140:"fa fa-calendar",
"Split Checker Summary":"fa fa-columns",145:"fa fa-compress","Merge Checker Summary":'fa fa-code-fork',"CP  Date Checker Summary":"fa fa-calendar-check-o", "Write off Checker Summary":"fa fa-pencil-square-o",
172:"fa fa-fire","Transfer Maker Summary":"fa fa-exchange","Transfer Checker Summary":"fa fa-pie-chart","Category Change Maker Summary":"fa fa-cog","Category Change Checker Summary":"fa fa-gg", "Asset Sales Checker":"fa fa-balance-scale",
157:"fa fa-cog","FA PV":"fa fa-users", "PV Approver":"fa fa-users","FA Query":"fa fa-quora","Split Maker Summary":"fa fa-columns","Sale Maker Summary":"fa fa-balance-scale",142:"fa fa-random",144:"fa fa-snowflake-o",
146:"fa fa-cc-diners-club","Impairment Maker Summary":"fa fa-fire","Impairment Checker Summary":"fa fa-fire","Merge Maker summary":'fa fa-code-fork'//"fa fa-check-square"
,"FA-DEPRECIATION":"fa fa-cog","FA PV MAKER":"fa fa-users","AssetClub Add":"fa fa-cc-diners-club","Bucket Summary":"fa fa-fire","Fa-Report":"fa fa-cog","FA-Entry Repost":"fa fa-cog","FA-General Query":"fa fa-database","FA-QConnect":"fa fa-database"
};
  constructor(private router: Router,private apcser:SharedService) { }
  menugrid:any;
  ngOnInit(): void {
    let data: any = this.apcser.submodulesfa.value;
    this.menugrid=data
    console.log('fghgi')
    console.log(this.menugrid)
  }


  assetwriteoffmakerRoute() {
    this.router.navigate(['fa/WriteOff', 'maker'])

  }

  assetwriteoffcheckerRoute() {
    this.router.navigate(['fa/WriteOff', 'checker'])
  }
  valuechangemakersummary() {
    this.router.navigate(['fa/valuechangemakersummary'], { skipLocationChange: isSkipLocationChange })
  }
  valuechangecheckersummary() {
    this.router.navigate(['fa/valuechangecheckersummary'], { skipLocationChange: isSkipLocationChange })
  }
  transfermakersummary() {
    this.router.navigate(['fa/transfermakersummary'], { skipLocationChange: isSkipLocationChange })
  }
  transfercheckersummary() {
    this.router.navigate(['fa/transfercheckersummary'], { skipLocationChange: isSkipLocationChange })
  }
  categorychangesummary() {
    this.router.navigate(['fa/categorychangesummary'], { skipLocationChange: isSkipLocationChange })
  }
  categorychangeapprove() {
    this.router.navigate(['fa/categorychangeapprove'], { skipLocationChange: isSkipLocationChange })
  }

  assetSplitmakerRoute() {
    this.router.navigate(['fa/Split', 'maker'])
  }
  assetSplitcheckerRoute() {
    this.router.navigate(['fa/Split', 'checker'])
  }
  assetMergemakerRoute() {
    this.router.navigate(['fa/Merge', 'maker'])
  }
  assetMergecheckerRoute() {
    this.router.navigate(['fa/Merge', 'checker'])
  }
  assetImpairmentmakerRoute() {
    this.router.navigate(['fa/Impairment', 'maker'])
  }
  assetImpairmentcheckerRoute() {
    this.router.navigate(['fa/Impairment', 'checker'])
  }

  assetmaker() {
    console.log('hii')
    this.router.navigate(['fa/assetmakersummary']);
  }
  assetchecker() {
    this.router.navigate(['fa/assetcheckersummary'])
  }
  cpdatechange() {
    this.router.navigate(['fa/cpdatechangesummary'], { skipLocationChange: isSkipLocationChange })
  }
  Assetsalesummary() {
    this.router.navigate(['fa/Assetsalesummary'], { skipLocationChange: isSkipLocationChange })

  }
  assetsaleschecker() {
    this.router.navigate(['fa/assetsalesapprove'], { skipLocationChange: isSkipLocationChange })
  }

  cpdatechangechecker() {
    this.router.navigate(['fa/cpdatechangechecker'], { skipLocationChange: isSkipLocationChange });
  }
}
