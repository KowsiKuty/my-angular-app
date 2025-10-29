import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NotificationService } from 'src/app/service/notification.service';
import { TnebShareService } from '../tneb-share.service';
import { TnebService } from '../tneb.service';


export interface statelist {
  id: number;
  name: string;
}

@Component({
  selector: 'app-electricityboardmaster',
  templateUrl: './electricityboardmaster.component.html',
  styleUrls: ['./electricityboardmaster.component.scss']
})



export class ElectricityboardmasterComponent implements OnInit {

  boardform: FormGroup
  boardsummary: FormGroup

  statedata: any;
  state_has_next = true;
  state_has_previous = true;
  state_presentpage = 1
  boarddata: any;
  board_hasnext = true
  board_hasprevious = true
  board_currentpage = 1


  constructor(private fb: FormBuilder, private tnebservice: TnebService, private notification: NotificationService, public tnebshareservice: TnebShareService) { }

  ngOnInit(): void {



    this.boardform = this.fb.group({
      name: [''],
      state_id: [''],
      id: [''],
    })

    this.boardsummary = this.fb.group({
      board_name: ['']
    })

    this.boardget('', this.board_currentpage = 1)

  }

  getstatelist(value, page) {

    this.tnebservice.getstate(value, page).subscribe(
      result => {

        this.statedata = result['data']
        let dataPagination = result['pagination']
        if (this.statedata.length >= 0) {
          this.state_has_next = dataPagination.has_next;
          this.state_has_previous = dataPagination.has_previous;
          this.state_presentpage = dataPagination.index;
        }


      }
    )

  }

  statescroll() {

  }


  public displaystate(data?: statelist): string | undefined {
    return data ? data.name : undefined;
  }

  boardsubmit() {

    this.boardform.value.state_id = this.boardform.value.state_id.id
    // delete this.boardform.value.id

    if(this.boardform.value.id == '' || this.boardform.value.id == null ){
      delete this.boardform.value.id
    }

    this.tnebservice.ebboardsubmit(this.boardform.value).subscribe(
      result => {
        console.log(result)

        if (result['id']) {
          this.notification.showSuccess('Successfully Created')
          this.backtosummary()
        }

      }

    )

  }

  boardget(value, page) {


    this.tnebservice.getebboard(value, page).subscribe(
      result => {
        this.boarddata = result['data'];
        let datapagination = result['pagination']
        console.log(result)

        if (this.boarddata.length >= 0) {
          this.board_hasnext = datapagination.has_next;
          this.board_hasprevious = datapagination.has_previous;
          this.board_currentpage = datapagination.index;
        }

      })
  }

  previousboard() {
    if (this.board_hasprevious == true) {
      this.boardget(this.boardsummary.value.board_name, this.board_currentpage - 1)
    }
  }

  nextboard() {
    if (this.board_hasnext == true) {
      this.boardget(this.boardsummary.value.board_name, this.board_currentpage + 1)
    }
  }

  add() {
    this.boardform.reset()

    this.tnebshareservice.summaryscreen = false
    this.tnebshareservice.ebboardid.next('')
    this.boardget('', this.board_currentpage = 1)
  }

  edit(value) {

    this.tnebshareservice.summaryscreen = false
    this.tnebshareservice.ebboardid.next(value)
    this.boardget('', this.board_currentpage = 1)
    this.getparticularebboard(value)
    console.log(this.tnebshareservice.summaryscreen)
    console.log(this.tnebshareservice.ebboardid)

  }


  getparticularebboard(value) {

    this.tnebservice.getparticularebboard(value).subscribe(
      result => {
        let data =result
        this.boardform.patchValue({
          name: data.name,
          state_id: data.state_id,
          id: data.id,
        })
      }
    )
  }

  backtosummary() {
    this.boardform.reset()
    this.tnebshareservice.summaryscreen = true
    // this.tnebshareservice.ebboardid.next('')
    this.boardget('', this.board_currentpage = 1)

  }

}
