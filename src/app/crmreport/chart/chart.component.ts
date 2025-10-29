import { animate, state, style, transition, trigger } from '@angular/animations';
import { DatePipe } from '@angular/common';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
// import Chart from 'chart.js/auto'
import { Chart } from 'chart.js'
import { NgxSpinnerService } from 'ngx-spinner';
import { NgxSpinner } from 'ngx-spinner/lib/ngx-spinner.enum';
// import { ReportService } from 'src/app/report/report.service';
import { ReportsService } from '../reports.service';
// import ChartDataLabels from 'chartjs-plugin-datalabels';
// import 'chartjs-plugin-datalabels';
// import 'chartjs-plugin-doughnutlabel';

export interface Objdatas {
  code: any;
  id: any;
}

export interface vendor {
  name: any;
  id: any
}

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  animations: [
    trigger('displayState', [
      state('false', style({ overflow: 'hidden', height: '0px', opacity: '0', })),
      state('true', style({ overflow: 'hidden', height: '*', opacity: '*' })),
      transition('false => true', animate('200ms ease-in')),
      transition('true => false', animate('200ms ease-out'))
    ]),
  ]
})
export class ChartComponent implements OnInit {

  //   colors = ['#007bff','#28a745','#333333','#c3e6cb','#dc3545','#6c757d'];

  public chart: any;
  campaingdata: any;
  vendata: any;

  //  chLine: any = document.getElementById("chLine");
  //  chartData = {
  //   labels: ["S", "M", "T", "W", "T", "F", "S"],
  //   datasets: [{
  //     data: [589, 445, 483, 503, 689, 692, 634],
  //     backgroundColor: 'transparent',
  //     borderColor: this.colors[0],
  //     borderWidth: 4,
  //     pointBackgroundColor: this.colors[0]
  //   }]
  // }

  doughnutChartLabels: string[] = ['data', 'In-Store Sales', 'Mail-Order Sales'];
  doughnutChartData: number[] = [350, 450, 100];
  chartOptions = {
    responsive: true
  };

  chartform: FormGroup
  total: any = '';
  reportdata: any;
  vendorleadsreport: any;


  constructor(private reportservice: ReportsService, private spinner: NgxSpinnerService, private fb: FormBuilder, private datepipe: DatePipe) { }

  ngOnInit(): void {

    this.chartform = this.fb.group({
      vendor: [''],
      campaign: [''],
      chartstyle: [1],
      camp_or_vendor: [1],
    })

    // this.doughnut(this.doughnutChartLabels, this.doughnutChartData,3);
    // this.getchartdata()
    // if (this.chLine) {
    //   new Chart(this.chLine, {
    //   type: 'line',
    //   data: this.chartData,
    //   options: {
    //     scales: {
    //       xAxes: [{
    //         ticks: {
    //           beginAtZero: false
    //         }
    //       }]
    //     },
    //     legend: {
    //       display: false
    //     },
    //     responsive: true
    //   }
    //   });
    // }
    this.getleadsreport('', true)
    this.getvendorleads()
  }

  canvas: any;
  ctx: any;
  @ViewChild('mychart') mychart;

  createChart() {

    this.chart = new Chart("MyChart", {
      type: 'doughnut', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: ['2022-05-10', '2022-05-11', '2022-05-12', '2022-05-13',
          '2022-05-14', '2022-05-15', '2022-05-16', '2022-05-17',],
        datasets: [
          {
            label: "Sales",
            data: ['467', '576', '572', '79', '92',
              '574', '573', '576'],
            // backgroundColor: 'blue'
          },
          {
            label: "Profit",
            data: ['542', '542', '536', '327', '17',
              '0.00', '538', '541'],
            // backgroundColor: 'limegreen'
          }
        ]
      },
      options: {
        aspectRatio: 2.5
      }

    });
  }

  getchartdata() {

    let vendor = (this.chartform.value.vendor?.id) ? this.chartform.value.vendor?.id : ''
    let campaign = (this.chartform.value.campaign?.id) ? this.chartform.value.campaign?.id : ''

    console.log('search vendor', this.chartform.value.vendor, this.chartform.value.vendor?.id)
    console.log('search campaign', this.chartform.value.campaign, this.chartform.value.campaign?.id)

    this.spinner.show()

    this.reportservice.getchartreport(vendor, campaign).subscribe(
      result => {
        this.spinner.hide()

        console.log(result)

        let label = ['Remaining leads', 'Lead To Customer', 'Not Interested Lead']
        let value = [result.LEADCOUNT, result.LEADTOCUSTOMER, result.NOTINTERESTEDLEAD]
        this.total = result.LEADCOUNT + result.LEADTOCUSTOMER + result.NOTINTERESTEDLEAD
        this.doughnut(label, value, this.total)
      }, (error) => {
        this.spinner.hide()

      }
    )
  }


  CampaignDD(typeddata) {

    // this.spinner.show()

    this.reportservice.getcampaigndrod(typeddata)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.campaingdata = datas
      }, (error) => {
        // this.error.handleError(error);
        this.spinner.hide();
      })
  }
  public displayFnCampaign(Campaign?: Objdatas): string | undefined {
    return Campaign ? Campaign.code : undefined;
  }

  vendordata(value) {
    this.reportservice.getvensearch(value, 1).subscribe(data => {
      this.vendata = data['data'];
    })
  }

  public displayvendor(vendor?: vendor): string | undefined {
    return vendor ? vendor.name : undefined;
  }

  doughnut(label, value, total) {


    // var ctx:any = document.getElementById("MyChart");
    // ctx.style.width = 300;
    // ctx.style.height = 300;

    // this.chart = new Chart('MyChart', {
    //   type: 'doughnut',

    //   data: {
    //     labels: label,
    //     datasets: [
    //       {
    //         label: 'My First Dataset',
    //         data: value,
    //         backgroundColor: [
    //           'rgb(255, 205, 86)',

    //           'rgb(54, 162, 235)',
    //           'rgb(255, 99, 132)',

    //         ],
    //         hoverOffset: 4,
    //       },
    //     ],
    //   },

    //   options: {
    //     borderRadius: 10,
    //     aspectRatio:3,
    //     maintainAspectRatio: true,
    //     title: {
    //       display: true,
    //       text: "Lead Chart"
    //     },

    //     }

    // });
  }

  searchchartdata(label, value, total) {

    // this.chart= new Chart('MyChart', {
    //   type: 'doughnut',
    //   data: {
    //     datasets: [
    //       {
    //         data: value,
    //         backgroundColor: [
    //           'rgb(255, 205, 86)',

    //           'rgb(54, 162, 235)',
    //           'rgb(255, 99, 132)',

    //         ],
    //         label: label,
    //       },
    //     ],
    //     labels: ['Item one', 'Item two', 'Item three', 'Item four'],
    //   },
    //   options: {
    //     responsive: true,
    //     legend: {
    //       display: false,
    //       position: 'top',
    //     },
    //     title: {
    //       display: true,
    //       fontSize: 20,
    //       text: 'Calculated value',
    //     },
    //     animation: {
    //       animateScale: true,
    //       animateRotate: true,
    //     },
    // plugins: {
    //   doughnutlabel: {
    //     labels: [
    //       {
    //         text: '220',
    //         font: {
    //           size: '60',
    //           units: 'em',
    //           family: 'Arial, Helvetica, sans-serif',
    //           style: 'italic',
    //           weight: 'bold',
    //         },
    //         color: '#bc2c1a',
    //       },
    //     ],
    //   },
    //     },
    //   },
    // });
  }

  resetsearchform() {
    this.chartform.patchValue({
      vendor: '',
      campaign: ''
    })
    this.total = ''
    this.chart.destroy()

  }

  getleadsreport(campaign, flag) {
    this.spinner.show()
    this.reportservice.getleadsreport(campaign, flag).subscribe(
      result => {
        this.spinner.hide()

        this.reportdata = result['result'];
        for (let i = 0; i < result['result'].length; i++) {
          this.reportdata[i].is_expansion = false
          this.reportdata[i].vendor_list = []
          this.reportdata[i].remaining_leads = this.reportdata[i].LEADCOUNT - this.reportdata[i].LEADTOCUSTOMER - this.reportdata[i].NOTINTERESTEDLEAD
          console.log('limits')
        }
        console.log('reportdata', this.reportdata)
      }, error => {
        this.spinner.hide()
      }
    )
  }

  getcampaignvendor(campaign, flag, j) {

    if (this.reportdata[j].is_expansion) {
      this.reportdata[j].is_expansion = false
      return false
    }
    this.spinner.show()
    this.reportservice.getleadsreport(campaign, flag).subscribe(
      result => {
        this.spinner.hide()

        this.reportdata[j].vendor_list = result['result'];
        this.reportdata[j].is_expansion = true
        for (let i = 0; i < result['result'].length; i++) {
          this.reportdata[j].vendor_list[i].is_expansion = false
          this.reportdata[j].vendor_list[i].employee_list = []
          this.reportdata[j].vendor_list[i].remaining_leads = this.reportdata[j].vendor_list[i].LEADCOUNT - this.reportdata[j].vendor_list[i].LEADTOCUSTOMER - this.reportdata[j].vendor_list[i].NOTINTERESTEDLEAD
        }

        console.log('leads ', this.reportdata)

      }, error => {
        this.spinner.hide()
      })
    console.log('report', this.reportdata)
  }


  getcampaignchartdata(campaign, flag) {
    this.reportservice.getleadsreport(campaign, flag).subscribe(
      result => {
        this.spinner.hide()

        let value = result['result'].map(x => x.LEADTOCUSTOMER)
        let label = result['result'].map(x => x.campaign_name)

        console.log('label value', label, value)
        this.getchart(label, value)

      })
  }

  getchart(label, value) {
    this.chart = new Chart("MyChart", {
      type: "bar",
      data: {
        labels: label,
        datasets: [
          {
            label: "# of Votes",
            data: value,
            backgroundColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 0.2)",
              // "rgba(255, 206, 86, 0.2)",
              // "rgba(75, 192, 192, 0.2)",
              // "rgba(153, 102, 255, 0.2)",
              // "rgba(255, 159, 64, 0.2)"
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              // "rgba(255, 206, 86, 1)",
              // "rgba(75, 192, 192, 1)",
              // "rgba(153, 102, 255, 1)",
              // "rgba(255, 159, 64, 1)"
            ],
            borderWidth: 1
          }
        ]
      },
      options: {
        // scales: {
        //   yAxes: [
        //     {
        //       ticks: {
        //         beginAtZero: true
        //       }
        //     }
        //   ]
        // }
      }
    });
  }

  getvendoremployeeleadsdata(i, j, vendorid, campaign) {

    if (this.reportdata[i].vendor_list[j].is_expansion) {
      this.reportdata[i].vendor_list[j].is_expansion = false
      return false
    }

    this.spinner.show()
    this.reportservice.getvendorleadsreport(vendorid, campaign).subscribe(
      result => {
        this.spinner.hide()

        this.reportdata[i].vendor_list[j].employee_list = result['result']

        this.reportdata[i].vendor_list[j].is_expansion = true
        for (let k = 0; k < result['result'].length; k++) {
          this.reportdata[i].vendor_list[j].employee_list[k].leadview = -1
          this.reportdata[i].vendor_list[j].employee_list[k].remaining_leads = this.reportdata[i].vendor_list[j].employee_list[k].emp_leads - this.reportdata[i].vendor_list[j].employee_list[k].lead_to_customer - this.reportdata[i].vendor_list[j].employee_list[k].not_int_lead
          this.reportdata[i].vendor_list[j].employee_list[k].leaadsdata = []
          this.reportdata[i].vendor_list[j].employee_list[k].is_expansion = false

        }

      }, error => {
        this.spinner.hide()
      }
    )
  }

  getemployeeleads(i, j, k, campaign, vendorid, empoyeeid) {

    if (this.reportdata[i].vendor_list[j].employee_list[k].is_expansion) {
      this.reportdata[i].vendor_list[j].employee_list[k].is_expansion = false
      return false
    }

    this.spinner.show()
    this.reportservice.getemployeeleads(campaign, vendorid, empoyeeid).subscribe(
      result => {
        this.spinner.hide()
        this.reportdata[i].vendor_list[j].employee_list[k].leaadsdata = result['data']

        this.reportdata[i].vendor_list[j].employee_list[k].is_expansion = true
        this.reportdata[i].vendor_list[j].employee_list[k].leaadsdata.sort((a, b) => parseFloat(b.lead_status) - parseFloat(a.lead_status));

        // for (let l = 0; l < result['result'].length; l++) {

      }

    )
  }

  getvendorleads() {
    this.spinner.show()
    this.reportservice.getvendorleadsdata().subscribe(
      result => {
        this.spinner.hide()
        this.vendorleadsreport = result['result']

        for (let i = 0; i < result['result'].length; i++) {
          this.vendorleadsreport[i].campaign_data = []
          this.vendorleadsreport[i].is_expansion = false

        }

      })
  }

  getcampaignlead(index, vendorid) {
    if (this.vendorleadsreport[index].is_expansion) {
      this.vendorleadsreport[index].is_expansion = false
      return false
    }
    this.spinner.show()

    this.reportservice.getvendorcampaigndata(vendorid).subscribe(
      result => {
        this.spinner.hide()

        this.vendorleadsreport[index].campaign_data = result['result']
        this.vendorleadsreport[index].is_expansion = true

        for (let i = 0; i < result['result'].length; i++) {
          this.vendorleadsreport[index].campaign_data[i].employee_list = []
          this.vendorleadsreport[index].campaign_data[i].is_expansion = false

        }

      })
  }

  getcampaignemployee(i, j, vendorid, campaign) {

    if (this.vendorleadsreport[i].campaign_data[j].is_expansion) {
      this.vendorleadsreport[i].campaign_data[j].is_expansion = false
      return false
    }

    this.spinner.show()
    this.reportservice.getvendorleadsreport(vendorid, campaign).subscribe(
      result => {
        this.spinner.hide()

        this.vendorleadsreport[i].campaign_data[j].employee_list = result['result']

        this.vendorleadsreport[i].campaign_data[j].is_expansion = true
        for (let k = 0; k < result['result'].length; k++) {
          this.vendorleadsreport[i].campaign_data[j].employee_list[k].remaining_leads = this.reportdata[i].vendor_list[j].employee_list[k].emp_leads - this.reportdata[i].vendor_list[j].employee_list[k].lead_to_customer - this.reportdata[i].vendor_list[j].employee_list[k].not_int_lead
          this.vendorleadsreport[i].campaign_data[j].employee_list[k].leaadsdata = []
          this.vendorleadsreport[i].campaign_data[j].employee_list[k].is_expansion = false

        }

      }, error => {
        this.spinner.hide()
      }
    )
  }

  getleadsofcampaignemployee(i, j, k, campaign, vendorid, empoyeeid) {

    if (this.vendorleadsreport[i].campaign_data[j].employee_list[k].is_expansion) {
      this.vendorleadsreport[i].campaign_data[j].employee_list[k].is_expansion = false
      return false
    }

    this.spinner.show()
    this.reportservice.getemployeeleads(campaign, vendorid, empoyeeid).subscribe(
      result => {
        this.spinner.hide()
        this.vendorleadsreport[i].campaign_data[j].employee_list[k].leaadsdata = result['data']

        this.vendorleadsreport[i].campaign_data[j].employee_list[k].is_expansion = true

        // for (let l = 0; l < result['result'].length; l++) {
        this.vendorleadsreport[i].campaign_data[j].employee_list[k].leaadsdata.sort((a, b) => parseFloat(b.lead_status) - parseFloat(a.lead_status));
      }

    )
  }

  getexceldownload(campaign, i) {
    // let value=this.chartform.value.camp_or_vendor

    // if(value == 1){
    //   //campaign
    // }
    // else{
    // }
    

    this.reportservice.getcampaignexceldownload(campaign?.campaign_id)
      .subscribe((data) => {
        // this.SpinnerService.hide()
        let binaryData = [];
        binaryData.push(data)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = campaign?.campaign_name + this.datepipe.transform(new Date(), 'dd/MM/yyyy') + ".xlsx";
        link.click();
      }, error => {
        // this.SpinnerService.hide()
      })

  }

}
