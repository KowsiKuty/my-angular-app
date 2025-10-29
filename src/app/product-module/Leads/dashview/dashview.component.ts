import { Component, OnInit } from '@angular/core';
import  { Chart }  from 'chart.js';
import { LeadsmainService } from '../leadsmain.service';

@Component({
  selector: 'app-dashview',
  templateUrl: './dashview.component.html',
  styleUrls: ['./dashview.component.scss']
})
export class DashviewComponent implements OnInit {
  public chart: any;
  public charts: any;
  list:any;
  s_list:any;

  constructor() { }

  ngOnInit(): void {
    this.createChart();
    this.createCharts();
    this.barcharts();
    this.checkbox();
    // this.getExecutivelList();
  }

  checkbox(){
    this.s_list = this.second_data
    this.list = this.business_data
  }

//  // get executive list
//  getExecutivelList() {
//   // this.SpinnerService.show();
//   this.vbharatService.getRole()
//     .subscribe(result => {
//       // this.SpinnerService.hide();
//       console.log("get executive", result)
//       this.list = result['data'];
//       if(result.Error){
//         this.notification.showError(result.Error)
//         this.SpinnerService.hide();
//         return false;
//       }
//     }, (error) => {
//       this.errorHandler.handleError(error);
//       this.SpinnerService.hide();
//     }
//     )
// }

  createChart(){

    
    this.chart = new Chart("MyChart", {
      type: 'doughnut', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: ['No. of Calls assigned', 'Pending calls','Lead to Customer'],
        datasets: [
          {
            label: "Sales",
            data: [1070, 417, 653],
            backgroundColor: ['#0C356A','#279EFF','#40F8FF']
          }
        ]
      },
      options: {
        aspectRatio: 2.5
      }

    });

  }

  createCharts(){
  
    this.charts = new Chart("MyCharts", {
      type: 'bar', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: ['car loan', 'Jewelery Loan', 'Business Loans', 'Personal Loan','Vehicle Loan' ], 
	       datasets: [
          {
            
            data: [5,4,2,2,3,0],
            backgroundColor: ['#0C356A', '#FF52A2', '#9D44C0', '#C08261', '#040D12']
          }
        ]
      },
      options: {
        aspectRatio:2.5
      }
      
    });
  }

barcharts()
{
//   var chartElement = document.getElementById('myChart') as ChartItem;

//   var myChart = new Chart(document.getElementById("bar-chart-horizontal"), {
//     type: 'horizontalBar',
//     data: {
//       labels: ["Not Interested", "PTB", "Reschedule"],
//       datasets: [
//         {
//           // label: "Lead Status",
//           backgroundColor: ["#9A3B3B", "#FF9B50","#E7B10A"],
//           data: [18,17,15,0]
//         }
//       ]
//     },
//     options: {
//       legend: { display: false },
//       title: {
//         display: true,
//         text: 'Task Status'
//       }
//     }
// });
}




business_data = [
  {
      "id": "Select all",
      "flag": false
  },
  {
      "id": "Alice Williams",
      "flag": false
  },
  {
      "id": "Gemma Cooper",
      "flag": false
  },
  {
      "id": "Julia Churchill",
      "flag": false
  },
  {
      "id": "Molly Ker Hawn",
      "flag": false
  },
  {
      "id": "Peter Straus",
      "flag": false
  },
  {
      "id": "Sallyanne Sweeney",
      "flag": false
  },
  {
      "id": "Sarah Hornsley",
      "flag": false
  },
  {
      "id": "Simon Trewin",
      "flag": false
  },
  {
      "id": "UB000022",
      "flag": false
  },
  {
      "id": "UB000024",
      "flag": false
  },
  {
      "id": "UB000025",
      "flag": false
  },
  {
      "id": "UB000026",
      "flag": false
  },
  {
      "id": "UB000033",
      "flag": false
  },
  {
      "id": "UB000034",
      "flag": false
  },
  {
      "id": "UB000040",
      "flag": false
  },
  {
      "id": "UB000045",
      "flag": false
  },
  {
      "id": "UB000046",
      "flag": false
  },
  {
      "id": "UB000047",
      "flag": false
  },
  {
      "id": "UB000048",
      "flag": false
  },
  {
      "id": "UB000049",
      "flag": false
  },
  {
      "id": "UB000052",
      "flag": false
  }
]


second_data = [
  {
      "id": "Select all",
      "flag": false
  },
  {
      "id": "Alice Williams",
      "flag": false
  },
  {
      "id": "Gemma Cooper",
      "flag": false
  },
  {
      "id": "Julia Churchill",
      "flag": false
  },
  {
      "id": "Molly Ker Hawn",
      "flag": false
  },
  {
      "id": "Peter Straus",
      "flag": false
  },
  {
      "id": "Sallyanne Sweeney",
      "flag": false
  },
  {
      "id": "Sarah Hornsley",
      "flag": false
  },
  {
      "id": "Simon Trewin",
      "flag": false
  },
  {
      "id": "UB000022",
      "flag": false
  },
  {
      "id": "UB000024",
      "flag": false
  },
  {
      "id": "UB000025",
      "flag": false
  },
  {
      "id": "UB000026",
      "flag": false
  },
  {
      "id": "UB000033",
      "flag": false
  },
  {
      "id": "UB000034",
      "flag": false
  },
  {
      "id": "UB000040",
      "flag": false
  },
  {
      "id": "UB000045",
      "flag": false
  },
  {
      "id": "UB000046",
      "flag": false
  },
  {
      "id": "UB000047",
      "flag": false
  },
  {
      "id": "UB000048",
      "flag": false
  },
  {
      "id": "UB000049",
      "flag": false
  },
  {
      "id": "UB000052",
      "flag": false
  }
]




}
