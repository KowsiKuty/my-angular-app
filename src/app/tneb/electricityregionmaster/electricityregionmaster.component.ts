import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NotificationService } from 'src/app/service/notification.service';
import { TnebShareService } from '../tneb-share.service';
import { TnebService } from '../tneb.service';


export interface displayboard{
  id:number;
  name:string;
}

@Component({
  selector: 'app-electricityregionmaster',
  templateUrl: './electricityregionmaster.component.html',
  styleUrls: ['./electricityregionmaster.component.scss']
})



export class ElectricityregionmasterComponent implements OnInit {

  regionform: FormGroup;
  regionsummary:FormGroup;

  statedata: any;
  state_has_next = true;
  state_has_previous = true;
  state_presentpage = 1

  boarddata:any;
  board_hasnext=true;
  board_hasprevious=true;
  board_currentpage=1;

  regiondata: any;
  region_hasnext=true;
  region_hasprevious=true;
  region_currentpage=1;

  constructor(private fb: FormBuilder, private tnebservice: TnebService, private notification: NotificationService,public tnebshareservice:TnebShareService) { }

  ngOnInit(): void {

    this.regionform = this.fb.group({
      region_name: [''],
      // region_code: [''],
      eb_board: [''],
      id: [''],
    })


    this.regionsummary=this.fb.group({
      region_name:['']
    })
    this.regionget('',this.region_currentpage)
  

  }

  getstatelist(value, page) {

    // this.tnebservice.getstatedata(value,page).subscribe(
    //   result => {

    //     this.statedata=result['data']
    //     let dataPagination=result['pagination']
    //     if (this.statedata.length >= 0) {
    //       this.state_has_next = dataPagination.has_next;
    //       this.state_has_previous = dataPagination.has_previous;
    //       this.state_presentpage = dataPagination.index;
    //     }


    //   }
    // )

  }

  statescroll() {

  }


  public displayboard(data ?:displayboard):string | undefined{
    return data?data.name:undefined;
  }

  regionsubmit() {

    // this.regionform.value.region_code=1

    this.regionform.value.eb_board=this.regionform.value.eb_board.id
    if(this.regionform.value.id == '' || this.regionform.value.id == null ){
      delete this.regionform.value.id
    }

    this.tnebservice.regionsubmit(this.regionform.value).subscribe(
      result => {
        console.log(result)

        if (result['id']) {
          this.notification.showSuccess('Successfully Created')
        }

      }

    )

  }

  boardget(value,page) {


    this.tnebservice.getebboard(value,page).subscribe(
      result => {
        this.boarddata=result['data'];
        let datapagination=result['pagination']
        console.log(result)

        if (this.boarddata.length >= 0) {
          this.board_hasnext = datapagination.has_next;
          this.board_hasprevious = datapagination.has_previous;
          this.board_currentpage = datapagination.index;
        }

      })

  }

  add(){
    this.tnebshareservice.summaryscreen = false
    this.tnebshareservice.ebregionid.next('')
    this.regionform.reset()
  }

  regionget(value,page){
    
    this.tnebservice.getregionsummary(value, page).subscribe(
      result => {
        this.regiondata = result['data'];
        let datapagination = result['pagination']
        console.log(result)

        if (this.regiondata.length >= 0) {
          this.region_hasnext = datapagination.has_next;
          this.region_hasprevious = datapagination.has_previous;
          this.region_currentpage = datapagination.index;
        }

      })

  }

  edit(value){
    this.tnebshareservice.summaryscreen = false
    this.tnebshareservice.ebregionid.next(value)
    // this.getparticularebboard(value)
    if(value){
      this.getparticularregion(value)
    }
    console.log(this.tnebshareservice.summaryscreen)
    console.log(this.tnebshareservice.ebregionid)

  }


  getparticularregion(value){
    

    this.tnebservice.getparticularregion(value).subscribe(
      result => {
        let data =result
        this.regionform.patchValue({
          region_name: data.region_name,
          eb_board: data.eb_board,
          id: data.id,
        })
      }
    )

  }

  previousregion(){

    if(this.region_hasprevious){
      this.regionget(this.regionsummary.value.region_name,this.region_currentpage-1)
    }

  }

  nextregion(){
    if(this.region_hasnext){
      this.regionget(this.regionsummary.value.region_name,this.region_currentpage+1)
    }

  }

  backtosummary(){
    this.regionsummary.reset()
    this.tnebshareservice.summaryscreen = true
    // /tneb/electricityexpensemaster
    this.regionget(this.regionsummary.value.region_name='',this.region_currentpage)
  }

}
