import { Component, OnInit } from '@angular/core';
import {Chart,registerables} from 'chart.js';
import { LeadsmainService} from '../leadsmain.service';
import 'chartjs-plugin-datalabels';
Chart.register(...registerables);


@Component({
  selector: 'app-leads-dashboard',
  templateUrl: './leads-dashboard.component.html',
  styleUrls: ['./leads-dashboard.component.scss']
})
export class LeadsDashboardComponent implements OnInit {
  canvas:any;
  ctx:any;
  canvas1:any;
  ctx1:any;
  canvas2:any;
  ctx2:any;
  canvas3:any;
  ctx3:any;
  canvas5:any;
  ctx5:any;
//   arrayList={"data":[{"vendor":{"code":"SU002","name":"Vsolv pvt lmt"},
//   "total":"250","LTC":"140","conv_percentage":"60.75"},
//  {"vendor":{"code":"SU003","name":"Vsolv pvt lmt"},
//   "total":"450","LTC":"140","conv_percentage":"80.21"},
//  {"vendor":{"code":"SU006","name":"Vsolv pvt lmt"},
//   "total":"760","LTC":"140","conv_percentage":"40.14"},
//  {"vendor":{"code":"SU005","name":"Vsolv pvt lmt"},
//   "total":"430","LTC":"140","conv_percentage":"90.44"}]} 
arrayList:any;
  label_List:Array<any>=[];
  value_list:Array<any>=[];
  
  constructor(private service:LeadsmainService) { }

  ngOnInit(): void {
    let json = {
      "report_type":"DSA","order_by":"low"
    }
    this.service.adddsachart(json).subscribe(result=>{
      this.arrayList = result['data']
      console.log("arrylst",this.arrayList)
      for(let i=0;i<this.arrayList.length;i++){
        this.label_List.push(this.arrayList[i].vendor.name);
        console.log("lbllist",this.label_List)
        this.value_list.push(this.arrayList[i].ConversionRate);
      }
      this.canvas = document.getElementById('myChart');
      this.ctx = this.canvas.getContext('2d');
      try{
        let myChart:any = new Chart(this.ctx, {
          type: 'bar',
          
          
          data: {
             
              labels:this.label_List ,
              datasets: [{
                  label: '',
                  data:this.value_list,
                  backgroundColor: ["#702254", "#a8337d", "#e669b9", "#e68f96", "#a1343c", "#6b2328"],
                  barThickness: 25,
                  maxBarThickness:35,
                  barPercentage: 0.8,
              }],
          },
          options: {
            
            scales: {
              x: {
               
                  grid: {
                      display: false, // Remove x-axis gridlines
                      borderColor: 'transparent', 
                  },
                  ticks:{
                    display:false
                  },
                 
                  
              },
              y: {
                  grid: {
                      display: false, // Remove y-axis gridlines
                      borderColor: 'transparent', 
                  },
              },
          },
          
            responsive: true,
            indexAxis: 'y',
            plugins: {
              legend: {
                display: false,
              },
              datalabels: {
                anchor: 'center',
                align: 'center',
                display: true,
                color: 'white',
                font: {
                  weight: 'bold'
                },
                
              },
          },
            elements: {
              line: {
                borderWidth: 0, // Set the line borderWidth to 0 to remove the line outside the bars
              },
            },
            layout: {
              padding: {
                left: 10,  // Adjust the left padding to control bar spacing
                right: 10, // Adjust the right padding to control bar spacing
              },
            },
          },
          
        });
      }
      catch(error){
        console.log(error);
      }
  
      
    })
   
   

    this.canvas5 = document.getElementById('mypieChart');
    this.ctx5 = this.canvas5.getContext('2d');
    try{
      let mypieChart:any = new Chart(this.ctx5, {
        type: 'pie',
        
        
        data: {
           
            labels:["DSA 1", "DSA 2", "DSA 3","DSA 4", "DSA 5", "DSA 6"] ,
            datasets: [{
                label: '',
                data: [13,9,9,8,7,4],
                backgroundColor: ["#118dff", "#e66c37", "#12239e", "#6b007b", "#e044a7", "#744ec2"],
               
                
            }],
        },
        options: {
         responsive: true,
      
          plugins: {
            legend: {
              display: false,
              position:'top',
              labels: {
                boxWidth: 5, // Set the width of each legend item
                usePointStyle: true, // Optional: Display legend items as colored dots
              },
            },

            
          },
         
        },
      });
    }
    catch(error){
      console.log(error);
    }
  

  this.canvas1 = document.getElementById('mybarChart');
  this.ctx1 = this.canvas1.getContext('2d');
  try{
    let mybarChart:any = new Chart(this.ctx1, {
      type: 'bar',
      
      data: {
         
          labels:["North Zone", "South Zone", "West Zone","East Zone", "Central Zone"] ,
          datasets: [{
              label: '',
              data: [197,151,142,110,53],
              backgroundColor: ["#414fb1", "#ad5129", "#a8337d", "#808080", "#a38600"],
              borderWidth: 0,
              barThickness: 20,
              maxBarThickness: 30
              
          }]
      },
      options: {
        scales: {
          x: {
              grid: {
                  display: false, // Remove x-axis gridlines
                  borderColor: 'transparent', 
              },
          },
          y: {
              grid: {
                  display: false, // Remove y-axis gridlines
                  borderColor: 'transparent', 
              },
          },
      },
        responsive: true,
        indexAxis: 'y',
        plugins: {
          legend: {
            display: false,
          },
          datalabels: {
            anchor: 'end', // Position of the label (e.g., 'end', 'center', 'start')
            align: 'end', // Text alignment relative to the anchor (e.g., 'end', 'center', 'start')
            offset: 4, // Offset from the bar
            formatter: (value, context) => {
              return value; // Display the data value as the label
            },
          },
        },
        elements: {
          line: {
            borderWidth: 0, // Set the line borderWidth to 0 to remove the line outside the bars
          },
        },
        layout: {
          padding: {
            left: 10,  // Adjust the left padding to control bar spacing
            right: 10, // Adjust the right padding to control bar spacing
          },
        },
      },
      
    });
  }
  catch(error){
    console.log(error);
  }

  this.canvas2 = document.getElementById('mybarsChart');
  this.ctx2 = this.canvas2.getContext('2d');
  try{
    let mybarsChart:any = new Chart(this.ctx2, {
      type: 'bar',
      
      data: {
         
          labels:[["Car","Loan"],["Jewellery","Loan"],["Business","Loans"],["Personal","Loan"],["Vehicle","Loan"]] ,
          datasets: [{
              label: '',
              data: [4,4,2,2,1],
              backgroundColor: ["#0e1a77", "#f5c4af", "#9071ce", "#e8d166","#cccccc"],
              borderWidth: 0
          }]
      },
      options: {
        scales: {
          x: {
              grid: {
                  display: false, // Remove x-axis gridlines
                  borderColor: 'transparent', 
              },
              ticks:{
                autoSkip:false,
                maxRotation:0,
                minRotation:0,
               
              }
          },
          y: {
              grid: {
                  display: false, // Remove y-axis gridlines
                  borderColor: 'transparent', 
              },
              ticks:{
              display:false
              },
              beginAtZero: true,
              title: {
                display: true,
                text: 'Customer Count', // Label for the y-axis
                color: 'black',
                // position: 'left', // Position the label on the left side
                font: {
                  weight: 'bold'
                },
                padding: {
                  top: 8,
                  bottom: 0,
                },
              //  fullSize: true,
              },
          },
      },
        responsive: true,
       
        plugins: {
          title: {
            display: true,
            text: 'Product Name',
            color: 'black',
            position: 'bottom',
            align: 'center',
            font: {
            weight: 'bold'
            },
            padding: 8,
            fullSize: true,
            },
           
          legend: {
            display: false,
          },
          
        },
        elements: {
          line: {
            borderWidth: 0, // Set the line borderWidth to 0 to remove the line outside the bars
          },
        },
      },
    });
  }
  catch(error){
    console.log(error);
  }

  this.canvas3 = document.getElementById('myclusterChart');
  this.ctx3 = this.canvas3.getContext('2d');
  try{
    let myclusterChart:any = new Chart(this.ctx3, {
      type: 'bar',
      
      data: {
         
          labels:[["Your loan","your way"],["Borrow smart","borrow with us"],["Brand awareness", "campaign"],["Fast and","Flexible loans"],["Quick and","simple loans"]] ,
          datasets: [{
              label: '',
              data: [3,1,5,1,1],
              backgroundColor: ["#de6a73", "#118dff", "#70bbff", "#e1c233","#e66c37"],
              borderWidth: 0,
              barThickness: 10,
              maxBarThickness: 20
              
          },
          {
            label: '',
            data: [1,3,2,1,3],
            backgroundColor: ["#de6a73", "#118dff", "#e1c233", "#e66c37","#999999"],
            borderWidth: 0,
            barThickness: 10,
            maxBarThickness: 20
        },
        {
          label: '',
          data: [1,3,2,1,3],
          backgroundColor: ["#de6a73", "#118dff", "#70bbff", "#e1c233","#e66c37"],
          borderWidth: 0,
          barThickness: 10,
          maxBarThickness: 20
      },
      {
        label: '',
        data: [1,4,2,2,1],
        backgroundColor: ["#de6a73", "#118dff", "#e1c233", "#e66c37","#999999"],
        borderWidth: 0,
        barThickness: 10,
        maxBarThickness: 20
    },
    {
      label: '',
      data: [1,2,2,2,2],
      backgroundColor: ["#de6a73", "#118dff", "#70bbff", "#e1c233","#e66c37"],
      borderWidth: 0,
      barThickness: 10,
      maxBarThickness: 20
  }
        ]
      },
      options: {
        scales: {
          
          x: {
              grid: {
                  display: false, // Remove x-axis gridlines
                  borderColor: 'transparent', 
              },
              ticks:{
                autoSkip:false,
                maxRotation:0,
                minRotation:0,
               
              }
          },
          y: {
              grid: {
                  display: false, // Remove y-axis gridlines
                  borderColor: 'transparent', 
              },
              ticks:{
                display:false
              }
          },
          
      },
        responsive: true,
       
        plugins: {
          legend: {
            display: false,
          },
          
        },
        elements: {
          line: {
            borderWidth: 0, // Set the line borderWidth to 0 to remove the line outside the bars
          },
        },
      },
    });
  }
  catch(error){
    console.log(error);
  }

}



}
