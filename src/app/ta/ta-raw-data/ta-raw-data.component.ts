import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { TaService } from '../ta.service';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatSelectChange } from '@angular/material/select';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';



export interface Table{
  id:number
  name:string
  
}
export interface column{
  column:string
  
  }

@Component({
  selector: 'app-ta-raw-data',
  templateUrl: './ta-raw-data.component.html',
  styleUrls: ['./ta-raw-data.component.scss']
})

export class TaRawDataComponent implements OnInit {
  @ViewChild('TableInput') TableInput: any;
  @ViewChild('column') column: any;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  taRawDataForm:FormGroup;
  isLoading:boolean=false
  querylist=[]
  TableList=[]
  selectedTables: any[] = [];
  selectedColumns: string[][] = []; 
  columnList=[]
  tableData=[]
  has_tablenxt=false;
  has_tablepre=true;
  present_page=1;
  pageSize=10
  tablevalue: any[] = []; 
  table_list: any[] = [];
 
  jointype = [{ 'value': "inner", 'display': 'Inner Join' }, { 'value': "left", 'display': 'Left Join' }]
  column_list: { [key: number]: string[] } = {};
  tablename:any
  join_type: { [key: number]: string } = {};
   
 

  // tables = new FormControl([]);
  constructor( private fb: FormBuilder,private taservice: TaService,private toastr : ToastrService, private spinner:NgxSpinnerService,private datepipe: DatePipe) { }

  ngOnInit(): void {
    this.taRawDataForm = this.fb.group({
     
      'tables' : new FormControl(''),
      'columns':new FormControl(''),
      'fromDate':new FormControl(''),
      'toDate':new FormControl(''),
      'selectedOption': new FormControl(''),
      'joinType':new FormControl('')
    })

    this.taRawDataForm.get('tables')?.valueChanges
    .pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.isLoading = true),
      switchMap(selectedTable => {
       
        const selectedTableIds = Array.isArray(selectedTable) 
          ? selectedTable.map((table: any) => table.id) 
          : selectedTable ? [selectedTable.id] : [];
        return this.taservice.getColumnlist(selectedTableIds.join(','), '').pipe(
          finalize(() => this.isLoading = false)
        );
      })
    )
    .subscribe((results: any[]) => {
      this.columnList = results['data'] || [];
      this.getColumns();
    });


    
}
public displayFnColumn(column?: string): string {
  return column ? column : ''; 
}

public displayFnTable(table?: Table): string | undefined {
  return table ? table.name : undefined;
}


TableLists() {
  const selectedTable = this.taRawDataForm.get('tables')?.value || [];

   
  if (Array.isArray(selectedTable)) {
    this.tablevalue = selectedTable.map((table: any) => table.id);
    this.tablename=selectedTable.map((table: any) => table.name);
  } else {
    this.tablevalue = selectedTable ? [selectedTable.id] : [];
  }

  this.taservice.gettablelist().subscribe(result => {
    this.TableList = result['data'] || [];
   
    console.log("TableList", this.TableList);
  });
}

getColumns() {
  if (Array.isArray(this.tablevalue) && this.tablevalue.length > 0) {
    this.taservice.getColumnlist(this.tablevalue.join(','), '').subscribe(result => {
      this.columnList = result['data'] || [];
      console.log("columnList", this.columnList);
    });
  } else {
    console.warn("tablevalue is not an array or is empty");
  }}
  getcolumnslistdata(){
    this.isLoading = true;
    const selectedTable = this.taRawDataForm.get('tables')?.value|| '';
    this.tablevalue = selectedTable?.id || '';
    this.tablename =selectedTable||''
    if (!this.tablevalue) {
      this.toastr.warning('Please select the table name first.');
      return;
    }
  
  
      this.taservice.getColumnlist(this.tablevalue,'')
      .subscribe(result => {
        const datas=result['data']
        this.columnList= datas
       
        console.log("columnList",this.columnList)
      
      }) 
  }

  
  expandedTableIndex: number | null = null;

  expandEntryData(index: number): void {
    this.expandedTableIndex = this.expandedTableIndex === index ? null : index;
  }
  addForm(){
    let tabledata = this.taRawDataForm.get('tables').value||''
    let columdata =this.taRawDataForm.get('columns').value||''
    let join_type = this.taRawDataForm.get('joinType').value || '';

   
    if (tabledata && columdata.length > 0) {
    
      this.selectedTables.push({ name: tabledata, column: columdata});
      this.table_list.push(tabledata.id)
      this.column_list[tabledata.id] = columdata
      this.join_type[tabledata.id] = join_type['value'];

      this.taRawDataForm.get('tables').setValue('');
      this.taRawDataForm.get('columns').setValue([]);

    } else {
      console.warn("Please select both a table and at least one column.");
    }
}
deletetable(index: number): void {
  const tableToDelete = this.selectedTables[index];
  this.selectedTables.splice(index, 1);
  const tableIdIndex = this.table_list.indexOf(tableToDelete.name.id);
  if (tableIdIndex !== -1) {
    this.table_list.splice(tableIdIndex, 1);
  }

  delete this.column_list[tableToDelete.name.id];

}
fileDownload() {
 
  if (this.table_list.length === 0 || Object.keys(this.column_list).length === 0) {
    this.toastr.error('Please select at least one table and one column before downloading.');
    return;
  }
  const from_date = this.datepipe.transform(this.taRawDataForm.get('fromDate')?.value, 'yyyy-MM-dd') || '';
  const to_date = this.datepipe.transform(this.taRawDataForm.get('toDate')?.value, 'yyyy-MM-dd') || '';

  const data: any = {
    "table_list": this.table_list,
    "column_list": this.column_list,
    "from_date": from_date,
    "to_date": to_date,
    "join_type":this.join_type
  };
  const fileName = 'downloaded_file.xlsx';
  this.spinner.show()
  this.taservice.getfiledownload(data)
    .subscribe((results:Blob) => {
      this.spinner.hide()
      console.log("re", results)
      let binaryData = [];
      binaryData.push(results)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      link.click();
    })
    this.taRawDataForm.get('fromDate').setValue('');
    this.taRawDataForm.get('toDate').setValue('');
    this.taRawDataForm.get('joinType').setValue('');
    this.join_type = {};
}
onOptionChange(){
  const selectedOption = this.taRawDataForm.get('selectedOption')?.value;
  if (selectedOption === 'ALL'  || selectedOption === 'DATERANGE') {
    this.taRawDataForm.get('fromDate')?.reset();
    this.taRawDataForm.get('toDate')?.reset();
    this.taRawDataForm.get('tables')?.reset();
    this.taRawDataForm.get('columns')?.reset();
    this.taRawDataForm.get('joinType')?.reset();
  }
}
daterange(): boolean{
  return this.taRawDataForm.get('selectedOption')?.value === 'DATERANGE';
}
ALLTA(){
  return this.taRawDataForm.get('selectedOption')?.value === 'ALL';
}
icon: boolean = false;

click(){
    this.icon = !this.icon;
  }
}
