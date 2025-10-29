import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { PprService } from "../ppr.service";
import { Chart, registerables } from "chart.js";
import "chartjs-plugin-datalabels";
import { SharePprService } from "../share-ppr.service";
import { NgxSpinnerService } from "ngx-spinner";
Chart.register(...registerables);

@Component({
  selector: "app-ppr-chart",
  templateUrl: "./ppr-chart.component.html",
  styleUrls: ["./ppr-chart.component.scss"],
})
export class PprChartComponent implements OnInit {
  // @ViewChild('myChart', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  startIndex: number = 0; 
  canvas: any;
  ctx: any;
  myChart: any;
  levelslist: any;
  pie_chart: boolean = true;
  radar_chart: boolean = false;
  doughnut_chart: boolean = false;
  bar_chart: boolean = false;
  line_chart: boolean = false;
  chart_show:boolean=true;
  ppr_report:boolean=false;
  charts_dd = [
    { name: "Pie & Bar" ,key:"pie",id:1 },
    { name: "Doughnut & Line" ,key:"line" ,id:2},
    { name: "Radar & Column" ,key:"radar" ,id:3},
  ];
  chart_select_value: any;
  // myChart4: Chart<"radar", any[], any>;
  myChart3: Chart<"doughnut", any[], any>;
  myChart2: Chart<"bar", any[], any>;
  myChart1: any;
  ctx4: any;
  ctx3: any;
  ctx2: any;
  ctx1: any;
  canvas1: HTMLElement;
  canvas2: HTMLElement;
  canvas3: HTMLElement;
  canvas4: HTMLElement;
  a_canvas: any;
  b_canvas: any;
  c_canvas: any;
  d_canvas1: any;
  d_canvas: any;
  myChart5: any;
  myChart4: any;
  ctx5: any;
  ab_canvas: any;
  dashboard_data: any;
  chart_param: any;
  finyear_value: any;
  header: string[];
  businessviewheader:any=[]
  headerdata: any;
  chartOptions: any;
  dashboardupdown:any
  oninit: boolean=true;
  disablePrevious: boolean;
  disableNext: boolean;
  isLoading:boolean;
  chart_shwown: any;
  levelname: any;
  constructor(
    private dataService: PprService,
    private shareService: SharePprService,
    private SpinnerService: NgxSpinnerService
  ) {}

  label_List: Array<any> = [];
  value_list: Array<any> = [];
  ngOnInit(): void {
  
    this.SpinnerService.show();
    this.isLoading=true;
    setTimeout(() => {
           
            this.shareService.isSideNav = true;
            document.getElementById("mySidenav").style.width = "50px";
            document.getElementById("main").style.marginLeft = "40px";
            // document.getElementById("main").style.transition = "margin-left 0.5s";
            this.chart_param = this.shareService.chartparam.value;
            this.chart_shwown = this.shareService.chartshown.value;
            this.finyear_value = this.shareService.finyear_data.value;
            let data_level = { level: 1 };
            this.oninit = true;
            this.levelname = 'L0 - Net Income'
            this.dataService.getdata_level(data_level.level, this.chart_param,"").subscribe((results: any[]) => {
                let data = results['data'];
                console.log("dataa", data);
                let datalast_index = data.length;
                console.log("datlast", datalast_index);
                let data_amount = data.splice(datalast_index - 1);
                console.log("data_amount", data_amount);
                for (let levels of data) {
                    this.level_names.push(levels.name);
                    this.level_amount.push(levels.YTD);
                }
                this.label_List = this.level_names;
                this.value_list = this.level_amount;
                console.log("label_List", this.label_List);
                console.log("value_list", this.value_list);
                console.log("this.level_name", this.level_names);
                console.log("this.level_name", this.level_amount);

                this.first_function();
                this.level_dashboard_name();
            });
            console.log("param", this.chart_param);
               
    }, 2000);
    this.isLoading=false;
    
}


  first_function(){    
const chartCanvas1 = this.chartRef.nativeElement.getContext('2d');
const chartCanvas2 = this.chartRef2.nativeElement.getContext('2d');
  let delayedp
  this.myChart1 = new Chart(chartCanvas1, {
    type: 'doughnut',
    data: {
      labels: this.label_List,
      datasets: [{
        label: "doughnut",
        data: this.value_list,
        backgroundColor: this.generateRandomColors(this.label_List.length),
        borderWidth: 1,
      }],
    },
    options: {animation: {
      onComplete: () => {
        delayedp = true;
      },
      delay: (context) => {
        let delay = 0;
        if (context.type === 'data' && context.mode === 'default' && !delayedp) {
          delay = context.dataIndex * 300 + context.datasetIndex * 100;
        }
        return delay;
      },
    },
    plugins:{
      legend:{
        position:'right'
        },
        title: {
          display: true, // Display the title
          // text: 'Component Amount', // Title text
        },
    },
    scales: {
      x: {
        grid: {
          display: false, // Hide horizontal grid lines
        },
        beginAtZero: true,
      },
    },
    layout:{
      padding:{
        left: 0, // Adjust the left padding
        right: 0, // Adjust the right padding
        top: 0,
        bottom: 0
      }
    }
  
  }
  });
  let delayed;  
  this.myChart2 = new Chart(chartCanvas2, {
    type: 'bar',
    data: {
      labels: this.label_List,
      datasets: [{
        label: "Bar",
        data: this.value_list,
        backgroundColor: this.generateRandomColors(this.label_List.length),
        borderWidth: 1,
        barPercentage: 0.7, 
        categoryPercentage: 0.5 
      }],
    },
    options: {animation: {
      onComplete: () => {
        delayed = true;
      },
      delay: (context) => {
        let delay = 0;
        if (context.type === 'data' && context.mode === 'default' && !delayed) {
          delay = context.dataIndex * 300 + context.datasetIndex * 100;
        }
        return delay;
      },
    },
      plugins: {
          legend: {
              position: 'top',
              display: false,
          // text: 'Component Amount',
        },
      },
      scales: {
        x: {
          grid: {
            display: false, // Hide horizontal grid lines
          },
          beginAtZero: true,
        },
      },
      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0
        }
      }
    }
  });
  }

  level_dashboard_name(){
    let remove
// this.SpinnerService.show()
let flag=1
    this.dataService.report_level_Labels(flag,this.chart_param).subscribe((results: any[]) => {
      let datas = results["data"];    
      this.dashboard_data= datas;        
      let removearraydata=datas
          let menu_data=removearraydata;
    
      for(let i=0 ; i < menu_data.length; i++){        
        if(menu_data[i].code=='L13' || menu_data[i].code=='L12' || menu_data[i].code=='L10' || menu_data[i].code=='L11' || menu_data[i].code=='L9'){
          remove =[i]
               menu_data.splice(remove, 1);
        }
       
     
        console.log("menu_data",menu_data)
      }
      this.dashboardupdown=datas.length
      console.log("datas",datas)
      this.SpinnerService.hide()
    })
  }

  @ViewChild('chartCanvas1')chartRef: ElementRef;
  @ViewChild('chartCanvas2')chartRef2:ElementRef;  
  @ViewChild('chartCanvas3')chartRef3: ElementRef;
  @ViewChild('chartCanvas4')chartRef4:ElementRef;
  chart: any; 
 


 
  renderChart() {
    const chartCanvas1 = this.chartRef.nativeElement.getContext('2d');
    const chartCanvas2 =this.chartRef2.nativeElement.getContext('2d')
    // const chartType = this.chartOptions.id;
    // if (chartType === 1) {
      if (this.myChart1) {
        this.myChart1.destroy(); 
      }
      if (this.myChart2) {
        this.myChart2.destroy();
      } 
      let delayedp
      this.myChart1 = new Chart(chartCanvas1, {
        type: 'doughnut',
        data: {
          labels: this.label_List,
          datasets: [{
            label: "doughnut",
            data: this.value_list,
            backgroundColor: this.generateRandomColors(this.label_List.length),
            borderWidth: 1,
          }],
        },
        options: {animation: {
          onComplete: () => {
            delayedp = true;
          },
          delay: (context) => {
            let delay = 0;
            if (context.type === 'data' && context.mode === 'default' && !delayedp) {
              delay = context.dataIndex * 300 + context.datasetIndex * 100;
            }
            return delay;
          },
        },
        plugins:{
          legend:{
            position:'right'
            },
            title: {
              display: true, // Display the title
              // text: 'Component Amount', // Title text
            },
        },
        scales: {
          x: {
            grid: {
              display: false, // Hide horizontal grid lines
            },
            beginAtZero: true,
          },
        },
        layout:{
          padding:{
            left: 0, // Adjust the left padding
            right: 0, // Adjust the right padding
            top: 0,
            bottom: 0
          }
        }
      
      }
      });
      let delayed;
      
      this.myChart2 = new Chart(chartCanvas2, {
        type: 'bar',
        data: {
          labels: this.label_List,
          datasets: [{
            label: "Bar",
            data: this.value_list,
            backgroundColor: this.generateRandomColors(this.label_List.length),
            borderWidth: 1,
            barPercentage: 0.7, 
            categoryPercentage: 0.5 
          }],
        },
        options: {animation: {
          onComplete: () => {
            delayed = true;
          },
          delay: (context) => {
            let delay = 0;
            if (context.type === 'data' && context.mode === 'default' && !delayed) {
              delay = context.dataIndex * 300 + context.datasetIndex * 100;
            }
            return delay;
          },
        },
          plugins: {
              legend: {
                  position: 'top',
                  display: false,
              // text: 'Component Amount',
            },
          },
          scales: {
            x: {
              grid: {
                display: false, // Hide horizontal grid lines
              },
              beginAtZero: true,
            },
          },
          layout: {
            padding: {
              left: 0,
              right: 0,
              top: 0,
              bottom: 0
            }
          }
        }
      });   
  }

  chartsselect(newType) {    
   this.chartOptions = newType;  
    this.first_function()
  }





  hideAllCharts() {
    if (this.myChart) this.myChart.canvas.style.display = 'none';
    // if (this.myChart1) this.myChart1.canvas.style.display = 'none';
    if (this.myChart2) this.myChart2.canvas.style.display = 'none';
    if (this.myChart3) this.myChart3.canvas.style.display = 'none';
    if (this.myChart4) this.myChart4.canvas.style.display = 'none';
    // if ( this.myChart5) this.myChart5.canvas.style.display ='none';
}

showChart(chart,show) {
  if (show) {
    // this.hideAllCharts(); 
    if (chart) chart.canvas.style.display = 'block';
} else {
    if (chart) chart.canvas.style.display = 'none'; 
}
}
private generateRandomColors(count: number): string[] {
  const randomColors: string[] = [];
  for (let i = 0; i < count; i++) {
    const color = '#' + Math.floor(Math.random() * 16777215).toString(16);
    randomColors.push(color);
  }
  return randomColors;
}
  chart_back(){
this.chart_show=false;
this.ppr_report=true;
document.getElementById("mySidenav").style.width = "200px";
document.getElementById("main").style.marginLeft = "12rem";
this.shareService.isSideNav = false;
  }
   level_names=[]
   level_amount=[]
  particular_data(level){
    this.levelname = level.name
    let level_code=level.code
    this.label_List=[]
    this.value_list=[]
    this.level_names=[]
    this.level_amount=[]
this.SpinnerService.show()
    this.dataService.getdata_level(level.level,this.chart_param,level_code).subscribe((results: any[]) => {
      let data=results['data']
      this.SpinnerService.hide()
      console.log("dataa",data)
     let datalast_index=data.length
     console.log("datlast",datalast_index)
if(level_code=='L13' || level_code=='L12' || level_code=='L10' || level_code=='L11' || level_code=='L9'){
}else{
    let data_amount =data.splice(datalast_index-1)
    console.log("data_amount",data_amount)
}
   
     for(let levels of data){
      this.level_names.push(levels.name)
      this.level_amount.push(levels.YTD)
     }
     this.label_List=this.level_names
     this.value_list=this.level_amount
     console.log("label_List",this.label_List)
     console.log("value_list",this.value_list)
     console.log("this.level_name",this.level_names)
   console.log("this.level_name",this.level_amount)
   this.renderChart()
  
    })

  }

  getPreviousData() {
    if (this.startIndex > 0) {
      this.startIndex -= 6;
      this.disableNext = false;
    }
    if (this.startIndex === 0) {
      this.disablePrevious = true; 
    }
  }

  getNextData() {
    if (this.startIndex + 6 < this.dashboardupdown) {
      this.startIndex += 6; 
      this.disablePrevious = false; 
    }
    if (this.startIndex + 6 >= this.dashboardupdown) {
      this.disableNext = true; 
    }
  }

}
