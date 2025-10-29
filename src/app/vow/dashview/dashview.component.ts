import { Component, OnInit } from '@angular/core';
// import  Chart  from 'chart.js';
// import { Chart } from 'chart.js';
import { Chart, registerables} from 'chart.js';

Chart.register(...registerables);





import { VowService } from 'src/app/service/vow.service';
import { NotificationService } from 'src/app/service/notification.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingServiceService} from 'src/app/service/error-handling-service.service';
import { ToastrService } from 'ngx-toastr';
import { LeadserviceService } from 'src/app/lead/leadservice.service';

@Component({
  selector: 'app-dashview',
  templateUrl: './dashview.component.html',
  styleUrls: ['./dashview.component.scss']
})
export class DashviewComponent implements OnInit {
  public chart: any;
  public charts: any;
  list:any;
  camp_list:any;
  vendorid:any;
  barchart:any;
  doughnutchart:any;
  horizontalcharts:any;

  constructor(private vowservice:VowService,private errorHandler: ErrorHandlingServiceService ,private SpinnerService: NgxSpinnerService,
    private notification: NotificationService,private toastr: ToastrService,private leadservice: LeadserviceService
    ) { }

  ngOnInit(): void {
    // this.createChart();
    // this.createCharts();
    // this.barcharts();

    // this.checkbox();
    this.getvendorId();

  }


  getvendorId(){
    this.SpinnerService.show();
    this.leadservice.getVendor()
     .subscribe(result =>{
      this.SpinnerService.hide();
      console.log("vendor id",result)
      if(result.status == "success"){
      this.vendorid = result?.vendor_id;
      this.getCampaignList();
      }
     })
  }

  // checkbox(){
  //   this.s_list = this.second_data
  //   // this.list = this.business_data
  // }

 // get executive list
 getExecutivelList() {
  this.SpinnerService.show();
  this.vowservice.getExecutive()
    .subscribe(result => {
      this.SpinnerService.hide();
      console.log("get executive", result)
      this.list = result['data'];
      this.get_dashboard();
      if(result.Error){
        this.notification.showError(result.Error)
        this.SpinnerService.hide();
        return false;
      }
    }, (error) => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    }
    )
}

// campaign List
getCampaignList() {
  this.SpinnerService.show();
  this.vowservice.getCampaign(this.vendorid)
    .subscribe(result => {
      this.SpinnerService.hide();
      console.log("get campaign", result)
      this.camp_list = result['data'];
      this.getExecutivelList();
      if(result.Error){
        this.notification.showError(result.Error)
        this.SpinnerService.hide();
        return false;
      }
    }, (error) => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    }
    )
}

  // createChart(){

    
  //   this.chart = new Chart("MyChart", {
  //     type: 'doughnut', //this denotes tha type of chart

  //     data: {// values on X-Axis
  //       labels: ['No. of Calls assigned', 'Pending calls','Lead to Customer'],
  //       datasets: [
  //         {
  //           label: "Sales",
  //           data: [1070, 417, 653],
  //           backgroundColor: ['#0C356A','#279EFF','#40F8FF']
  //         }
  //       ]
  //     },
  //     options: {
  //       aspectRatio: 2.5
  //     }

  //   });

  // }

  // createCharts(){
  
  //   this.charts = new Chart("MyCharts", {
  //     type: 'bar', //this denotes tha type of chart

  //     data: {// values on X-Axis
  //       labels: ['car loan', 'Jewelery Loan', 'Business Loans', 'Personal Loan','Vehicle Loan' ], 
	//        datasets: [
  //         {
            
  //           data: [5,4,2,2,3,0],
  //           backgroundColor: ['#0C356A', '#FF52A2', '#9D44C0', '#C08261', '#040D12']
  //         }
  //       ]
  //     },
  //     options: {
  //       aspectRatio:2.5
  //     }
      
  //   });
  // }

// barcharts()
// // {
// //   this.funnelchart = new Chart("Myfunnel", {
// //     type: 'horizontalBar',
// //     data: {
// //       labels: ["Not Interested", "5PTB", "Reschedule"],
// //       datasets: [
// //         {
// //           // label: "Lead Status",
// //           backgroundColor: ["#9A3B3B", "#FF9B50","#E7B10A"],
// //           data: [18,17,15,0]
// //         }
// //       ]
// //     },
// //     options: {
// //       legend: { display: false },
// //       title: {
// //         display: true,
// //         text: 'Task Status'
// //       }
// //     }
// // });
// // }
// {
// //   var myChart = new Chart(document.getElementById("bar-chart-horizontal"), {
// //     type: 'horizontalBar',
// //     data: {
// //       labels: ["Not Interested", "5PTB", "Reschedule"],
// //       datasets: [
// //         {
// //           // label: "Lead Status",
// //           backgroundColor: ["#9A3B3B", "#FF9B50","#E7B10A"],
// //           data: [18,17,15,0]
// //         }
// //       ]
// //     },
// //     options: {
// //       legend: { display: false },
// //       title: {
// //         display: true,
// //         text: 'Task Status'
// //       }
// //     }
// // });
// }



reset(){
    this.get_dashboard();
  }



array=[];
camp_array=[];
convertedleads:any;
get_dashboard() {
  this.SpinnerService.show();
  this.array=[];
  this.camp_array=[];
  
//   for(let i=0; i < this.list.length; i++){
//     if(this.list[i].flag === true){
//       this.array.push(this.list[i].id)
//     }
//   }
  
//   for(let i=0; i < this.camp_list.length; i++){
//     if(this.camp_list[i].flag === true){
//       this.camp_array.push(this.camp_list[i].id)
//     }
//   }
//   if(this.array.length == 0) {
//       this.notification.showError("Invalid Data");
//       this.SpinnerService.hide();
//       return false;
//   }
//   if(this.camp_array.length == 0) {
//     this.notification.showError("Invalid Data");
//     this.SpinnerService.hide();
//     return false;
// }

   
  let checkbox_json = {
    "emp_id":this.array,
    "camp_id": this.camp_array
  }

  console.log("checkbox_json", checkbox_json)
//   this.barchart.destroy();
//   this.horizontalcharts.destroy();
//   this.doughnutchart.destroy();



  // bar chart color
  let barchart_stylejson = {
    // "barThickness": 50,
    // "backgroundColor": [
    //     "rgba(255, 99, 132, 0.2)",
    //     "rgba(255, 159, 64, 0.2)",
    //     "rgba(255, 205, 86, 0.2)",
    //     "rgba(75, 192, 192, 0.2)",
    //     "rgba(54, 162, 235, 0.2)",
    //     "rgba(153, 102, 255, 0.2)",
    //     "rgba(201, 203, 207, 0.2)"
    // ],
    backgroundColor: ['#0C356A', '#FF52A2', '#9D44C0', '#C08261', '#040D12'],
    barPercentage: 0.3

    
    // "borderColor": [
    //     "rgb(255, 99, 132)",
    //     "rgb(255, 159, 64)",
    //     "rgb(255, 205, 86)",
    //     "rgb(75, 192, 192)",
    //     "rgb(54, 162, 235)",
    //     "rgb(153, 102, 255)",
    //     "rgb(201, 203, 207)"
    // ],
    // "borderWidth": 1,
    // "borderRadius": 8
  }

  // horizontal chart 
  let horizontalchart_stylejson = {
    // "backgroundColor": [
    //   'rgb(54, 162, 235)', // drat-light blue
    //   'rgb(45,182,126)',  // approved- green
    //   'rgb(255, 205, 86)',// pending approval- light orange
    //   'rgb(255, 99, 132)', // rejected - red
    //   'red',
    //   'yellow',
    //   'grey',
    //   'purple',
    //   'orange',
    //   'violet'
       
    // ],
    backgroundColor: ["#9A3B3B", "#FF9B50","#E7B10A"],
    "hoverOffset": 4
  }

  // doughnut chart
  let doughnut_stylejson = {
    // "backgroundColor": [
    //   'rgb(13, 81, 144)', //blue -ecf
    //   'rgb(162, 205, 247)', // skyblue -po
    //   'rgb(255, 205, 86)',// pending approval- light orange
    //   'rgb(255, 99, 132)', // rejected - red
    //   'rgb(222, 99, 136)',
    //   'rgb(32, 99, 131)',
    //   'rgb(10, 99, 30)',
    //   'rgb(89, 99, 55)',
    //   'rgb(56, 90, 132)',
    //   'rgb(12, 54, 132)'
      
    // ],
    "backgroundColor": ['#0C356A','#279EFF','#40F8FF'],

    "hoverOffset": 4
  }

  this.vowservice.getDashbordSearch(checkbox_json,this.vendorid)
    .subscribe(result => {
      this.SpinnerService.hide();
      console.log("sb",result)
      // let result = this.Verify_DATA[0]
      this.convertedleads = result.converted_leads;
    // if(results.bar){
    //   console.log("dashboard", results)
    //   // this.dashboardAPI =results;
    //   // this.startCounter();
    //   this.list = results.business_data
      

        // bar chart
       for(let i=0; i< result.cc_by_product.data.datasets.length;i++){
        let object = result.cc_by_product.data.datasets[0]
        let temp = Object.assign({},object,barchart_stylejson)
        result.cc_by_product.data.datasets[0]=temp;
      }
    // horizontal chart
      for(let i=0; i< result.lead.data.datasets.length;i++){
        let object = result.lead.data.datasets[0]
        let temp = Object.assign({},object,horizontalchart_stylejson)
        result.lead.data.datasets[0]=temp;
     }
       // doughnut chart
      for(let i=0; i< result.call.data.datasets.length;i++){
        let object = result.call.data.datasets[0]
        let temp = Object.assign({},object,doughnut_stylejson)
        result.call.data.datasets[0]=temp;
      }
      

      this.barchart = new Chart("MybarChart", result.cc_by_product);
      console.log("verify BAR CHART",this.barchart)

      this.horizontalcharts = new Chart("MyHorizontalCharts", result.lead);
      console.log("horizontal CHART",this.horizontalcharts)

      this.doughnutchart = new Chart("MydoughnutChart", result.call);
      console.log("DOUGHNUT CHART",this.doughnutchart)

      this.SpinnerService.hide();  
    // }
    // else {
    //     this.notification.showError(results.Error)
    //     this.SpinnerService.hide();
    //     return false;
    // }
           
    }, (error) => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    }
    
    )
}


datas:any;
showanswer(e){

    // this.datas = this.showExeanswer(e)
    // if (this.datas === false){
    //     return false;
    // } 

    console.log("event",e)
    // if(e.checked){
        this.SpinnerService.show();
        this.array=[];


        for(let i=0; i < this.list.length; i++){
            if(this.list[i].flag === true){
              this.array.push(this.list[i].id)
            }
          }

    // if(e.checked){
        // this.SpinnerService.show();
        this.camp_array=[];


        // for(let i=0; i < this.list.length; i++){
        //     if(this.list[i].flag === true){
        //       this.array.push(this.list[i].id)
        //     }
        //   }
        //   let camp_array = [];
          for(let i=0; i < this.camp_list.length; i++){
            if(this.camp_list[i].flag === true){
              this.camp_array.push(this.camp_list[i].id)
            }
          }
        //   if(this.array.length == 0) {
        //       this.notification.showError("Invalid Data");
        //       this.SpinnerService.hide();
        //       return false;
        //   }
        //   if(this.camp_array.length == 0) {
        //     this.notification.showError("Invalid Data");
        //     this.SpinnerService.hide();
        //     return false;
        // }
        
        // console.log("camp",this.camp_array)
           
          let checkbox_json = {
            "emp_id":this.array,
            "camp_id": this.camp_array
          }
        
          console.log("checkbox_json", checkbox_json)
          this.barchart.destroy();
          this.horizontalcharts.destroy();
          this.doughnutchart.destroy();

          // bar chart color
    let barchart_stylejson = {
        // "barThickness": 50,
        // "backgroundColor": [
        //     "rgba(255, 99, 132, 0.2)",
        //     "rgba(255, 159, 64, 0.2)",
        //     "rgba(255, 205, 86, 0.2)",
        //     "rgba(75, 192, 192, 0.2)",
        //     "rgba(54, 162, 235, 0.2)",
        //     "rgba(153, 102, 255, 0.2)",
        //     "rgba(201, 203, 207, 0.2)"
        // ],
        backgroundColor: ['#0C356A', '#FF52A2', '#9D44C0', '#C08261', '#040D12'],
        barPercentage: 0.3
    
        
        // "borderColor": [
        //     "rgb(255, 99, 132)",
        //     "rgb(255, 159, 64)",
        //     "rgb(255, 205, 86)",
        //     "rgb(75, 192, 192)",
        //     "rgb(54, 162, 235)",
        //     "rgb(153, 102, 255)",
        //     "rgb(201, 203, 207)"
        // ],
        // "borderWidth": 1,
        // "borderRadius": 8
      }
    
      // horizontal chart 
      let horizontalchart_stylejson = {
        // "backgroundColor": [
        //   'rgb(54, 162, 235)', // drat-light blue
        //   'rgb(45,182,126)',  // approved- green
        //   'rgb(255, 205, 86)',// pending approval- light orange
        //   'rgb(255, 99, 132)', // rejected - red
        //   'red',
        //   'yellow',
        //   'grey',
        //   'purple',
        //   'orange',
        //   'violet'
           
        // ],
        backgroundColor: ["#9A3B3B", "#FF9B50","#E7B10A"],
        "hoverOffset": 4
      }
    
      // doughnut chart
      let doughnut_stylejson = {
        // "backgroundColor": [
        //   'rgb(13, 81, 144)', //blue -ecf
        //   'rgb(162, 205, 247)', // skyblue -po
        //   'rgb(255, 205, 86)',// pending approval- light orange
        //   'rgb(255, 99, 132)', // rejected - red
        //   'rgb(222, 99, 136)',
        //   'rgb(32, 99, 131)',
        //   'rgb(10, 99, 30)',
        //   'rgb(89, 99, 55)',
        //   'rgb(56, 90, 132)',
        //   'rgb(12, 54, 132)'
          
        // ],
        "backgroundColor": ['#0C356A','#279EFF','#40F8FF'],
    
        "hoverOffset": 4
      }

          this.vowservice.getDashbordSearch(checkbox_json,this.vendorid)
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log("verify",result)
        this.convertedleads = result.converted_leads;
       let results = this.Verify_DATA[0]
      if(result.lead.data.labels.length != 0){
     
  
          // bar chart
         for(let i=0; i< result.cc_by_product.data.datasets.length;i++){
          let object = result.cc_by_product.data.datasets[0]
          let temp = Object.assign({},object,barchart_stylejson)
          result.cc_by_product.data.datasets[0]=temp;
        }
      // horizontal chart
        for(let i=0; i< result.lead.data.datasets.length;i++){
          let object = result.lead.data.datasets[0]
          let temp = Object.assign({},object,horizontalchart_stylejson)
          result.lead.data.datasets[0]=temp;
       }
         // doughnut chart
        for(let i=0; i< result.call.data.datasets.length;i++){
          let object = result.call.data.datasets[0]
          let temp = Object.assign({},object,doughnut_stylejson)
          result.call.data.datasets[0]=temp;
        }
        
  
        this.barchart = new Chart("MybarChart", result.cc_by_product);
        console.log("verify BAR CHART",this.barchart)
  
        this.horizontalcharts = new Chart("MyHorizontalCharts", result.lead);
        console.log("horizontal CHART",this.horizontalcharts)
  
        this.doughnutchart = new Chart("MydoughnutChart", result.call);
        console.log("DOUGHNUT CHART",this.doughnutchart)
  
        this.SpinnerService.hide();  
      }
      else {
          this.notification.showError(result)
          this.SpinnerService.hide();
          return false;
      }
             
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      
      )
        
        
    
    // } 
}
// showExeanswer(e){
//     console.log(" exe ans",e)
//     // if(e.checked){
//         this.SpinnerService.show();
//         this.array=[];


//         for(let i=0; i < this.list.length; i++){
//             if(this.list[i].flag === true){
//               this.array.push(this.list[i].id)
//             }
//           }
//         //   let camp_array = [];
//         //   for(let i=0; i < this.camp_list.length; i++){
//         //     if(this.camp_list[i].flag === true){
//         //       this.camp_array.push(this.camp_list[i].id)
//         //     }
//         //   }
//         //   if(this.array.length == 0) {
//         //       this.notification.showError("Invalid Data");
//         //       this.SpinnerService.hide();
//         //       return false;
//         //   }
//         //   if(this.camp_array.length == 0) {
//         //     this.notification.showError("Invalid Data");
//         //     this.SpinnerService.hide();
//         //     return false;
//         // }
        
//         console.log("camp",this.array)
           
//           // let checkbox_json = {
//           //   "emp_id":this.array,
//           //   // "camp_id": this.camp_array
//           // }
          
//           let checkbox_json = this.array

//           console.log("checkbox_json", checkbox_json)
//     //       this.barchart.destroy();
//     //       this.horizontalcharts.destroy();
//     //       this.doughnutchart.destroy();

//     //       // bar chart color
//     // let barchart_stylejson = {
//     //     // "barThickness": 50,
//     //     // "backgroundColor": [
//     //     //     "rgba(255, 99, 132, 0.2)",
//     //     //     "rgba(255, 159, 64, 0.2)",
//     //     //     "rgba(255, 205, 86, 0.2)",
//     //     //     "rgba(75, 192, 192, 0.2)",
//     //     //     "rgba(54, 162, 235, 0.2)",
//     //     //     "rgba(153, 102, 255, 0.2)",
//     //     //     "rgba(201, 203, 207, 0.2)"
//     //     // ],
//     //     backgroundColor: ['#0C356A', '#FF52A2', '#9D44C0', '#C08261', '#040D12'],
//     //     barPercentage: 0.3
    
        
//     //     // "borderColor": [
//     //     //     "rgb(255, 99, 132)",
//     //     //     "rgb(255, 159, 64)",
//     //     //     "rgb(255, 205, 86)",
//     //     //     "rgb(75, 192, 192)",
//     //     //     "rgb(54, 162, 235)",
//     //     //     "rgb(153, 102, 255)",
//     //     //     "rgb(201, 203, 207)"
//     //     // ],
//     //     // "borderWidth": 1,
//     //     // "borderRadius": 8
//     //   }
    
//     //   // horizontal chart 
//     //   let horizontalchart_stylejson = {
//     //     // "backgroundColor": [
//     //     //   'rgb(54, 162, 235)', // drat-light blue
//     //     //   'rgb(45,182,126)',  // approved- green
//     //     //   'rgb(255, 205, 86)',// pending approval- light orange
//     //     //   'rgb(255, 99, 132)', // rejected - red
//     //     //   'red',
//     //     //   'yellow',
//     //     //   'grey',
//     //     //   'purple',
//     //     //   'orange',
//     //     //   'violet'
           
//     //     // ],
//     //     backgroundColor: ["#9A3B3B", "#FF9B50","#E7B10A"],
//     //     "hoverOffset": 4
//     //   }
    
//     //   // doughnut chart
//     //   let doughnut_stylejson = {
//     //     // "backgroundColor": [
//     //     //   'rgb(13, 81, 144)', //blue -ecf
//     //     //   'rgb(162, 205, 247)', // skyblue -po
//     //     //   'rgb(255, 205, 86)',// pending approval- light orange
//     //     //   'rgb(255, 99, 132)', // rejected - red
//     //     //   'rgb(222, 99, 136)',
//     //     //   'rgb(32, 99, 131)',
//     //     //   'rgb(10, 99, 30)',
//     //     //   'rgb(89, 99, 55)',
//     //     //   'rgb(56, 90, 132)',
//     //     //   'rgb(12, 54, 132)'
          
//     //     // ],
//     //     "backgroundColor": ['#0C356A','#279EFF','#40F8FF'],
    
//     //     "hoverOffset": 4
//     //   }

//       return checkbox_json

//       //     this.vowservice.getDashbordSearch(checkbox_json,this.vendorid)
//       // .subscribe(result => {
//       //   this.SpinnerService.hide();
//       //   console.log("verify",result)
//       //   this.convertedleads = result.converted_leads;
//       // //  let results = this.Verify_DATA[0]
//       // if(result.lead.data.labels.length != 0){
     
  
//       //     // bar chart
//       //    for(let i=0; i< result.cc_by_product.data.datasets.length;i++){
//       //     let object = result.cc_by_product.data.datasets[0]
//       //     let temp = Object.assign({},object,barchart_stylejson)
//       //     result.cc_by_product.data.datasets[0]=temp;
//       //   }
//       // // horizontal chart
//       //   for(let i=0; i< result.lead.data.datasets.length;i++){
//       //     let object = result.lead.data.datasets[0]
//       //     let temp = Object.assign({},object,horizontalchart_stylejson)
//       //     result.lead.data.datasets[0]=temp;
//       //  }
//       //    // doughnut chart
//       //   for(let i=0; i< result.call.data.datasets.length;i++){
//       //     let object = result.call.data.datasets[0]
//       //     let temp = Object.assign({},object,doughnut_stylejson)
//       //     result.call.data.datasets[0]=temp;
//       //   }
        
  
//       //   this.barchart = new Chart("MybarChart", result.cc_by_product);
//       //   console.log("verify BAR CHART",this.barchart)
  
//       //   this.horizontalcharts = new Chart("MyHorizontalCharts", result.lead);
//       //   console.log("horizontal CHART",this.horizontalcharts)
  
//       //   this.doughnutchart = new Chart("MydoughnutChart", result.call);
//       //   console.log("DOUGHNUT CHART",this.doughnutchart)
  
//       //   this.SpinnerService.hide();  
//       // }
//       // else {
//       //     this.notification.showError(result)
//       //     this.SpinnerService.hide();
//       //     return false;
//       // }
             
//       // }, (error) => {
//       //   this.errorHandler.handleError(error);
//       //   this.SpinnerService.hide();
//       // }
      
//       // )
        
        
    
//     // } 
// }


// get verify
get_verify() {
    this.SpinnerService.show();
    this.array=[];
    this.camp_array=[];
    
    for(let i=0; i < this.list.length; i++){
      if(this.list[i].flag === true){
        this.array.push(this.list[i].id)
      }
    }
    
    for(let i=0; i < this.camp_list.length; i++){
      if(this.camp_list[i].flag === true){
        this.camp_array.push(this.camp_list[i].id)
      }
    }
    if(this.array.length == 0) {
        this.notification.showError("Invalid Data");
        this.SpinnerService.hide();
        return false;
    }
    if(this.camp_array.length == 0) {
      this.notification.showError("Invalid Data");
      this.SpinnerService.hide();
      return false;
  }
  
     
    let checkbox_json = {
      "emp_id":this.array,
      "camp_id": this.camp_array
    }
  
    console.log("checkbox_json", checkbox_json)
    this.barchart.destroy();
    this.horizontalcharts.destroy();
    this.doughnutchart.destroy();
  
  
  
    // bar chart color
    let barchart_stylejson = {
      // "barThickness": 50,
      // "backgroundColor": [
      //     "rgba(255, 99, 132, 0.2)",
      //     "rgba(255, 159, 64, 0.2)",
      //     "rgba(255, 205, 86, 0.2)",
      //     "rgba(75, 192, 192, 0.2)",
      //     "rgba(54, 162, 235, 0.2)",
      //     "rgba(153, 102, 255, 0.2)",
      //     "rgba(201, 203, 207, 0.2)"
      // ],
      backgroundColor: ['#0C356A', '#FF52A2', '#9D44C0', '#C08261', '#040D12'],
      barPercentage: 0.3
  
      
      // "borderColor": [
      //     "rgb(255, 99, 132)",
      //     "rgb(255, 159, 64)",
      //     "rgb(255, 205, 86)",
      //     "rgb(75, 192, 192)",
      //     "rgb(54, 162, 235)",
      //     "rgb(153, 102, 255)",
      //     "rgb(201, 203, 207)"
      // ],
      // "borderWidth": 1,
      // "borderRadius": 8
    }
  
    // horizontal chart 
    let horizontalchart_stylejson = {
      // "backgroundColor": [
      //   'rgb(54, 162, 235)', // drat-light blue
      //   'rgb(45,182,126)',  // approved- green
      //   'rgb(255, 205, 86)',// pending approval- light orange
      //   'rgb(255, 99, 132)', // rejected - red
      //   'red',
      //   'yellow',
      //   'grey',
      //   'purple',
      //   'orange',
      //   'violet'
         
      // ],
      backgroundColor: ["#9A3B3B", "#FF9B50","#E7B10A"],
      "hoverOffset": 4
    }
  
    // doughnut chart
    let doughnut_stylejson = {
      // "backgroundColor": [
      //   'rgb(13, 81, 144)', //blue -ecf
      //   'rgb(162, 205, 247)', // skyblue -po
      //   'rgb(255, 205, 86)',// pending approval- light orange
      //   'rgb(255, 99, 132)', // rejected - red
      //   'rgb(222, 99, 136)',
      //   'rgb(32, 99, 131)',
      //   'rgb(10, 99, 30)',
      //   'rgb(89, 99, 55)',
      //   'rgb(56, 90, 132)',
      //   'rgb(12, 54, 132)'
        
      // ],
      "backgroundColor": ['#0C356A','#279EFF','#40F8FF'],
  
      "hoverOffset": 4
    }
  
    this.vowservice.getDashbordSearch(checkbox_json,this.vendorid)
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log("verify",result)
        this.convertedleads = result.converted_leads;
      //  let results = this.Verify_DATA[0]
      if(result.lead.data.labels.length != 0){
     
  
          // bar chart
         for(let i=0; i< result.cc_by_product.data.datasets.length;i++){
          let object = result.cc_by_product.data.datasets[0]
          let temp = Object.assign({},object,barchart_stylejson)
          result.cc_by_product.data.datasets[0]=temp;
        }
      // horizontal chart
        for(let i=0; i< result.lead.data.datasets.length;i++){
          let object = result.lead.data.datasets[0]
          let temp = Object.assign({},object,horizontalchart_stylejson)
          result.lead.data.datasets[0]=temp;
       }
         // doughnut chart
        for(let i=0; i< result.call.data.datasets.length;i++){
          let object = result.call.data.datasets[0]
          let temp = Object.assign({},object,doughnut_stylejson)
          result.call.data.datasets[0]=temp;
        }
        
  
        this.barchart = new Chart("MybarChart", result.cc_by_product);
        console.log("verify BAR CHART",this.barchart)
  
        this.horizontalcharts = new Chart("MyHorizontalCharts", result.lead);
        console.log("horizontal CHART",this.horizontalcharts)
  
        this.doughnutchart = new Chart("MydoughnutChart", result.call);
        console.log("DOUGHNUT CHART",this.doughnutchart)
  
        this.SpinnerService.hide();  
      }
      else {
          this.notification.showError(result)
          this.SpinnerService.hide();
          return false;
      }
             
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      
      )
  }









// executive list
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

// compaign list
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


// dashboard
Verify_DATA:any = [
  {
    "lead": {
        "type": "bar",
        "data": {
            "labels": [
                "Not Interested",
                "ptb",
                "reschedule"
            ],
            "datasets": [
                {
                    "label": "Lead - Task Status",
                    "data": [
                        0,
                        0,
                        0
                    ]
                }
            ]
        },
        "options": {
            "aspectRatio": 2.5,
            scales: {
              y: {
                beginAtZero: true
              },
            },
            indexAxis: 'y'
        }
    },
    "call": {
        "type": "doughnut",
        "data": {
            "labels": [
                "Total",
                "pending_calls",
                "LTC"
            ],
            "datasets": [
                {
                    "label": "Executive Call Summary",
                    "data": [
                        0,
                        0,
                        0
                    ]
                }
            ]
        },
        "options": {
            "aspectRatio": 2.5
        }
    },
    "converted_leads": 600,
    "cc_by_product": {
        "type": "bar",
        "data": {
            "labels": [
                "CAR LOAN",
                "HOME  LOAN",
                "Personal Loan"
            ],
            "datasets": [
                {
                    "label": "Product wise customer count by Product",
                    "data": [
                        0,
                        0,
                        0
                    ],
                    "barPercentage": 0.5
                }
            ]
        },
        "options": {
            "aspectRatio": 2.5,
            "scales": {
                "yAxes": [
                    {
                        "ticks": {
                            "beginAtZero": true
                        }
                    }
                ]
            }
        }
    }
}
]




}
