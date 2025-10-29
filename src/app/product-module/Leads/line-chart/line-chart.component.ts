import { Component, OnInit } from '@angular/core';
// import Chart from 'chart.js/auto';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {
  public chart: any;

  constructor() { }


 
  ngOnInit(): void {
    this.createChart();
  }

  createChart(){
  
    // this.chart = new Chart("MyChart", {
    //   type: 'line', 

    //   data: {
    //     labels: ['2022-05-10', '2022-05-11', '2022-05-12','2022-05-13',
		// 						 '2022-05-14', '2022-05-15', '2022-05-16','2022-05-17', ], 
	  //      datasets: [
    //       {
    //         label: "Leads",
    //         data: ['467','576', '572', '79', '92',
		// 						 '574', '573', '576'],
    //         backgroundColor: 'blue'
    //       },
    //       {
    //         label: "Sales",
    //         data: ['542', '542', '536', '327', '17',
		// 							 '0.00', '538', '541'],
    //         backgroundColor: 'limegreen'
    //       }  
    //     ]
    //   },
    //   options: {
    //     aspectRatio:2.5
    //   }
      
    // });
  }

}
