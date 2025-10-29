
import { Component, OnInit,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective, FormArrayName, NgControl } from '@angular/forms';
import { PprService } from '../ppr.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { MatFormFieldControl } from '@angular/material/form-field';
import { SharePprService } from '../share-ppr.service';
import { DatePipe } from '@angular/common';
import { MatDatepicker } from '@angular/material/datepicker';

@Component({
  selector: 'app-budget-builder',
  templateUrl: './budget-builder.component.html',
  styleUrls: ['./budget-builder.component.scss'],
  providers: [{ provide: MatFormFieldControl, useExisting: BudgetBuilderComponent }]

})
export class BudgetBuilderComponent implements OnInit {
  @ViewChild('datePicker') datePicker!: MatDatepicker<Date>; // Reference the date picker
  selectedTable: string = '';
  sechema_table: string = '';
  sechema_table_select: string = '';
  selectedFields: string[] = ['*'];
  selectedJoinTable_select : string = '';
  limit: number = 10;
  popupOpen: boolean = false;
  popupTitle: string = '';
  popupType: string = '';
  selectedField: string = '';
  selectedOperation: string = '';
  selectedValue: string = '';
  joinTable: string = '';
  selectedJoinTable: string = null;
  joinType: string = 'INNER JOIN';
  joinField: string = '';
  fieldDropdownOpen: boolean = false;
  selectAllFields: boolean = true;
  // filterLogic: 'AND' | 'OR' = 'AND';
  logicalOperator: string = 'AND';
  filterLogic: string = 'AND'; // Default logical operator
  innerjoin_tabletemp : any[]=[];


  tables: any = {
    users: ['id', 'name', 'email', 'created_at'],
    orders: ['order_id', 'user_id', 'amount', 'order_date'],
    products: ['product_id', 'name', 'price', 'stock'],
    pprservice_ppr_documents: ['id', 'file_name', 'gen_filename', 'file_size', 'type', 'status', 'created_by',
      'created_date',
      'updated_by',
      'updated_date',
      'date',
      'remarks'],
    dynamicreportservice_report_documents: ["id", "entity_id", "file_name", "gen_filename", "file_size", "type", "flag", "status", "created_by",
      "created_date",
      "updated_by",
      "updated_date",
      "date",
      "remarks"]
  };
  tableKeys: string[] = [];
  tableFields:any;
  secondTableFields: string[] = [];

  filters: any[] = [];
  joins: any[] = [];
  sorting: any[] = [];
  groupBy: any[] = [];
  summarize: any[] = [];
  joinTypes: string[] = ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN', 'CROSS JOIN'];
  sidebarSections = [
    { name: 'Select Column', key: 'Select Column' },
    { name: 'Filters', key: 'filters' },
    { name: 'Joins', key: 'joins' },
    { name: 'Sort', key: 'sorting' },
    { name: 'Summarize', key: 'summarize' },
    { name: 'Group By', key: 'groupBy' },
    { name: 'Limit', key: 'limit' }
  ];
  innerjoin_table: Set<any> = new Set();
  innerjoin_table_schemea: Set<any> = new Set();
  template_group: FormGroup;
  query_contant: string = 'SELECT * FROM LIMIT 10';
  schema_name: any;
  qurymain_screen:boolean = true;
  sqlmainscreen:boolean = false;
  temp_summary:boolean = false;
  connection_id: any;
  jointablekeys: string[];
  jointablekeyssec: any;
  editedQuery: string;
  multi_single_scheme: any;
  schema_names_arr: string[] = [];
  schema_names_arr_popup: string[] = [];
  schema_names_arr_popup2: string[] = [];
  innerjoin_table_schemea_pop: any[];
  schema_name_prams: any;
  datacheck: number = 1;
  filteredTables_temp: {
    schema: any; tables: unknown[]; // Convert Set to Array for easier usage
  }[];
  inputType: string = 'text';
  constructor(private SpinnerService: NgxSpinnerService, private dataService: PprService, private formBuilder: FormBuilder, private toastr: ToastrService,private pprsharedservice :SharePprService,private datepipe:DatePipe) { this.getFormattedQuery(`SELECT * FROM LIMIT 10`); }

  ngOnInit() {
    this.schema_name = this.pprsharedservice.schema_name.value
    this.multi_single_scheme = this.pprsharedservice.multi_single_scheme.value
    this.connection_id = this.pprsharedservice.connection_id.value
    this.template_group = this.formBuilder.group({
      Template_name: "",
    })
    if(this.multi_single_scheme != 'Multiple_scheme'){
      this.Get_tablenames()
    }
    // this.tableKeys = Object.keys(this.tables);
  }

  copySQL() {
    let query
    if (JSON.stringify(this.query_contant.trim()) === JSON.stringify(this.editedQuery.trim())) {
      console.log("Queries are identical");
      query = this.query_contant
    } else {
        console.log("Queries are different");
        this.getFormattedQuery(this.editedQuery);
        query = this.editedQuery
    }
    navigator.clipboard.writeText(query).then(() => alert('SQL Query copied!'));
  }

  downloadSQL() {
    const blob = new Blob([this.generateQuery()], { type: 'text/sql' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'query.sql';
    link.click();
  }

  async  onTableSelect() {
    this.Clear_query('Ts')
    this.tableFields = await this.get_table_columns(this.selectedTable) || [];
    this.selectedFields = ['*'];
    this.generateQuery();
    this.filteradd()
  }

  filteradd(){
    this.filters_field.forEach(filter => {
      filter.filteredTableFields = [...this.tableFields];
    });
  }

  async onSecondTableSelect(join) {
    if (join.joinTable) {
      join.secondTableFields = await this.get_table_columns(join.joinTable) || [];
      join._secoriginalFields
    } else {
      join.secondTableFields = [];
    }
  }


  toggleFieldDropdown() {
    this.fieldDropdownOpen = !this.fieldDropdownOpen;
  }


  openPopup(type: string) {
    if((this.sechema_table == '' || this.sechema_table == undefined || this.sechema_table == null) && this.multi_single_scheme == 'Multiple_scheme'){
      this.toastr.error("","Please Choose Schema")
      return false;
    }
    if(this.selectedTable == '' || this.selectedTable == undefined || this.selectedTable == null){
      this.toastr.error("","Please Choose Table")
      return false;
    }
    this.popupType = type;
    this.popupTitle = this.sidebarSections.find(s => s.key === type)?.name || '';
    this.popupOpen = true;
    this.selectedField = '';
    this.selectedOperation = '';
    this.selectedValue = '';
    this.joinTable = '';
    this.joinField = '';
    this.selectedJoinTable = '';
  }

  addCondition() {
    if(this.popupType == 'filters'){
      if(this.isAnyFilterInvalid()){
        this.toastr.error("","Please choose All Field")
        return false
      }
    }
    if(this.popupType == 'joins'){
      if(this.isAnyjoinInvalid()){
        this.toastr.error("","Please choose All Field")
        return false
      }
    }
    if(this.popupType == 'sorting'){
      if(this.isAnysortInvalid()){
        this.toastr.error("","Please choose All Field")
        return false
      }
    }
    if(this.popupType == 'summarize'){
      if(this.isAnysummarInvalid()){
        this.toastr.error("","Please choose All Field")
        return false
      }
    }
    if(this.popupType == 'groupBy'){
      if(this.isAnygroupInvalid()){
        this.toastr.error("","Please choose All Field")
        return false
      }
    }
    
    switch (this.popupType) {
        case 'filters':
          this.filters_field.forEach(filterItem => {
            if (!filterItem.selectedField || !filterItem.selectedOperation) return;
        
            let filter = {
                selectedField: filterItem.selectedField.column_name,
                selectedOperation: filterItem.selectedOperation,
                selectedValue: filterItem.selectedValue,
                logicalOperator: this.filters.length > 0 || this.filters_field.length > 1 ? filterItem.logicalOperator : '',
                selectedJoinTable: filterItem.selectedJoinTable ? `${filterItem.selectedJoinTable}.` : `${this.selectedTable}.`,
                sechema_table:filterItem.sechema_table ? filterItem.sechema_table : this.schema_name,
                data_type:filterItem.inputType
            };
        
            // **Modify Value Based on Operation**
            if (filterItem.selectedOperation === 'IS NULL' || filterItem.selectedOperation === 'IS NOT NULL') {
                filter.selectedValue = null;
            } else if (filterItem.selectedOperation === 'IN' || filterItem.selectedOperation === 'NOT IN') {
                filter.selectedValue = `(${filterItem.selectedValue.split(',').map(val => `'${val.trim()}'`).join(', ')})`;
            } else if (filterItem.selectedOperation === 'LIKE' || filterItem.selectedOperation === 'NOT LIKE') {
                filter.selectedValue = `%${filterItem.selectedValue}%`;
            } else if (filterItem.selectedOperation === 'BETWEEN' || filterItem.selectedOperation === 'NOT BETWEEN') {
                let values = filterItem.selectedValue.split(',');
                if (values.length === 2) {
                    filter.selectedValue = `'${values[0].trim()}' AND '${values[1].trim()}'`;
                } else {
                    console.warn("BETWEEN requires two values separated by a comma.");
                    return;
                }
            } else if (filterItem.selectedOperation === 'EXISTS' || filterItem.selectedOperation === 'NOT EXISTS') {
                filter.selectedValue = `(${filterItem.selectedValue})`; // Should be a subquery
            }
        
            this.filters.push(filter);
        });
        
        break;  
      case 'joins':
        this.joins_field.forEach(filterItem => {
          this.joins.push({
            type: filterItem.joinType,
            schema1: filterItem.sechema_table1 ? filterItem.sechema_table1 : this.schema_name,
            table1: filterItem.selectedTable,
            column1: filterItem.selectedField,
            schema2: filterItem.sechema_table2 ? filterItem.sechema_table2 : this.schema_name,
            table2: filterItem.joinTable,
            column2: filterItem.joinField
          });
          if (this.multi_single_scheme === 'Multiple_scheme') {
                      // Function to add a table under a schema
            const addTableToSchema = (schemaName: string, tableName: string) => {
              // Find the schema in the array
              const schemaEntry = this.innerjoin_tabletemp.find(entry => entry.schema === schemaName);

              if (schemaEntry) {
                  // Add table to the Set (duplicates are automatically ignored)
                  schemaEntry.tables.add(tableName);
              } else {
                  // Create a new entry with a Set for tables if schema doesn't exist
                  this.innerjoin_tabletemp.push({
                      schema: schemaName,
                      tables: new Set([tableName])  // Initialize with a Set to prevent duplicates
                  });
              }
            };

            // Adding tables based on conditions
            if (this.multi_single_scheme === 'Multiple_scheme') {
              addTableToSchema(filterItem.sechema_table1 || this.schema_name, filterItem.selectedTable);
              addTableToSchema(filterItem.sechema_table2 || this.schema_name, filterItem.joinTable);
              addTableToSchema(this.sechema_table, this.selectedTable);
            }

            // Convert Set to Array when assigning to filteredTables_temp
            this.filteredTables_temp = this.innerjoin_tabletemp.map(entry => ({
              schema: entry.schema,
              tables: Array.from(entry.tables)  // Convert Set to Array for easier usage
            }));
          console.log("temp rv",this.filteredTables_temp)
          this.innerjoin_table_schemea.add(filterItem.sechema_table1 ? filterItem.sechema_table1 : this.schema_name)
          this.innerjoin_table_schemea.add(filterItem.sechema_table2 ? filterItem.sechema_table2 : this.schema_name)
          this.innerjoin_table_schemea.add(this.sechema_table)
          this.innerjoin_table_schemea_pop = [...this.innerjoin_table_schemea]; 
        }else{
            this.innerjoin_table.add(filterItem.selectedTable)
            this.innerjoin_table.add(filterItem.joinTable)
            this.innerjoin_table.add(this.selectedTable)
            this.innerjoin_table_schemea.add(filterItem.sechema_table1 ? filterItem.sechema_table1 : this.schema_name)
            this.innerjoin_table_schemea.add(filterItem.sechema_table2 ? filterItem.sechema_table2 : this.schema_name)
            this.innerjoin_table_schemea.add(this.sechema_table)
            this.filteredTables = [...this.innerjoin_table]; 
            this.innerjoin_table_schemea_pop = [...this.innerjoin_table_schemea]; 
        }
        });
        break;
      case 'sorting':
        this.sortConditions.forEach(filterItem => {
          this.sorting.push({ column: filterItem.selectedField, order: filterItem.selectedOperation, table: filterItem.selectedJoinTable ? `${filterItem.selectedJoinTable}.` : `${this.selectedTable}.`,sechema_table:filterItem.sechema_table ? filterItem.sechema_table : this.schema_name });
        });
        break;
      case 'summarize':
        this.summarizeConditions.forEach(filterItem => {
          this.summarize.push({ column: filterItem.selectedField, function: filterItem.selectedOperation, table: filterItem.selectedJoinTable ? `${filterItem.selectedJoinTable}.` : `${this.selectedTable}.`,sechema_table:filterItem.sechema_table ? filterItem.sechema_table : this.schema_name });
        });
        break;
      case 'groupBy':
        this.groupByConditions.forEach(filterItem => {
          this.groupBy.push({ column: filterItem.selectedField, table: filterItem.selectedJoinTable ? `${filterItem.selectedJoinTable}.` : `${this.selectedTable}.`,sechema_table:filterItem.sechema_table ? filterItem.sechema_table : this.schema_name });
        })
        break;
      case 'limit':
        this.limit = this.limit
    }

    this.generateQuery();
    this.closePopup();
  }


  generateQuery(): string {
    if (!this.selectedTable) return 'SELECT * FROM table_name';
    let selectClause = '*'
    if (this.select_column.length && this.summarize.length) {
      selectClause = [
        ...this.select_column.map(s => `${s.table}`),
        ...this.summarize.map(s => `${s.function}(${s.sechema_table}.${s.table}${s.column}) AS '${s.function.toLowerCase()}_${s.sechema_table}_${s.table}${s.column}'`)
      ].join(', ');
    } else if (this.select_column.length) {
      selectClause = this.select_column.map(s => `${s.table}`).join(', ');
    } else if (this.summarize.length) {
      selectClause = this.summarize.map(s => `${s.function}(${s.sechema_table}.${s.table}${s.column}) AS '${s.function.toLowerCase()}_${s.sechema_table}_${s.table}${s.column}'`).join(', ');
    }

    let query = `SELECT ${selectClause} FROM ${this.schema_name}.${this.selectedTable}`;
    if (this.joins.length) {
      this.joins.forEach(join => {
        query += ` ${join.type} ${join.schema2}.${join.table2} ON ${join.schema1}.${join.table1}.${join.column1} = ${join.schema2}.${join.table2}.${join.column2}`;
      });
    }
    if (this.filters.length) {
      let conditions: string[] = [];

      this.filters.forEach((f, index) => {
        let condition = "";
        const tablePrefix = f.selectedJoinTable;

        if (f.selectedOperation === "IS NULL" || f.selectedOperation === "IS NOT NULL") {
          condition = `${f.sechema_table}.${tablePrefix}${f.selectedField} ${f.selectedOperation}`;
        } else if (f.selectedOperation === "IN" || f.selectedOperation === "NOT IN") {
          condition = `${f.sechema_table}.${tablePrefix}${f.selectedField} ${f.selectedOperation} ${f.data_type === 'number' ? parseInt(f.selectedValue) : f.data_type === 'date' ? `'${this.datepipe.transform(f.selectedValue, 'yyyy-MM-dd') || f.selectedValue}'` : `'${f.selectedValue}'`}`;
        } else if (f.selectedOperation === "LIKE" || f.selectedOperation === "NOT LIKE") {
          condition = `${f.sechema_table}.${tablePrefix}${f.selectedField} ${f.selectedOperation} ${f.data_type === 'number' ? parseInt(f.selectedValue) : f.data_type === 'date' ? `'${this.datepipe.transform(f.selectedValue, 'yyyy-MM-dd') || f.selectedValue}'` : `'${f.selectedValue}'`}`;
        } else if (f.selectedOperation === "BETWEEN" || f.selectedOperation === "NOT BETWEEN") {
          condition = `${f.sechema_table}.${tablePrefix}${f.selectedField} ${f.selectedOperation} ${f.data_type === 'number' ? parseInt(f.selectedValue) : f.data_type === 'date' ? `'${f.selectedValue}'` : `'${f.selectedValue}'`}`;
        } else if (f.selectedOperation === "EXISTS" || f.selectedOperation === "NOT EXISTS") {
          condition = `${f.selectedOperation} ${f.data_type === 'int' ? parseInt(f.selectedValue) : f.data_type === 'date' ? `'${this.datepipe.transform(f.selectedValue, 'yyyy-MM-dd') || f.selectedValue}'` : `'${f.selectedValue}'`}`;
        } else {
          condition = `${f.sechema_table}.${tablePrefix}${f.selectedField} ${f.selectedOperation} ${f.data_type === 'number' ? parseInt(f.selectedValue) : f.data_type === 'date' ? `'${this.datepipe.transform(f.selectedValue, 'yyyy-MM-dd') || f.selectedValue}'` : `'${f.selectedValue}'`}`;
        }

        // **Apply Logical Operator if needed**
        if (index > 0) {
          condition = `${f.logicalOperator} ${condition}`;
        }

        conditions.push(condition);
      });

      query += ` WHERE ${conditions.join(" ")}`;
    }

    if (this.groupBy.length) {
      query += ` GROUP BY ${this.groupBy.map(field => `${field.sechema_table}.${field.table}${field.column}`).join(', ')}`;
    }
    if (this.sorting.length) {
      const sortFields = this.sorting.map(s => `${s.sechema_table}.${s.table}${s.column} ${s.order}`).join(', ');
      query += ` ORDER BY ${sortFields}`;
    }

    if (this.limit > 0) {
      query += ` LIMIT ${this.limit};`;
    }

    this.query_contant = query
    this.editedQuery = query
    this.filters_field = [{ selectedField: '', selectedOperation: '=', selectedValue: '', logicalOperator: 'AND', selectedJoinTable: '', sechema_table: '',inputType:'text'  }];
    this.getFormattedQuery(query)
    return query;
  }



  addNewFilter() {
    this.filters.push({ column: '', operator: '', value: null, logic: 'AND' });
  }

  applyFilters() {
    this.generateQuery();
    this.closePopup();
  }


  closePopup() {
    this.popupOpen = false;
    this.selectedField = '';
    this.selectedOperation = '';
    this.selectedFields = ['*'];
    this.selectedValue = '';
    this.joinTable = '';
    this.joinField = '';
    this.joinType = 'INNER JOIN';
    this.filters_field = [{ selectedField: '', selectedOperation: '=', selectedValue: '', logicalOperator: 'And', selectedJoinTable: '',sechema_table : '',inputType:'text'  }];
    this.groupByConditions = [{ selectedJoinTable: '', selectedField: '' ,sechema_table:''}];
    this.summarizeConditions = [{ selectedJoinTable: '', selectedField: '', selectedOperation: '' ,sechema_table:''}];
    this.sortConditions = [{ selectedJoinTable: '', selectedField: '', selectedOperation: '',sechema_table:'' }];
    this.joins_field = [{ joinType: this.joinType, selectedTable: '', selectedField: '', joinTable: '', joinField: '',sechema_table1:'',sechema_table2:'' }]
  }

  formattedQuery: { text: string; class: string }[] = [];

  getFormattedQuery(query: string): void {
    const keywordPattern = /\b(SELECT|FROM|WHERE|INNER|JOIN|OUTER|LEFT|RIGHT|ORDER|BY|GROUP|INNER JOIN|OUTER JOIN|LEFT JOIN|RIGHT JOIN|ORDER BY|GROUP BY|HAVING|LIMIT|AS|COUNT|SUM|AVG|MIN|MAX|ON|CROSS|FULL|RIGHT|LEFT)\b/i;
    const operatorPattern = /\b(=|>|<|>=|<=|!=|IN|AND|OR|LIKE|IS NULL|IS NOT NULL|NOT IN|NOT|IS|NULL|EXISTS|NOT EXISTS|NOT BETWEEN|NOT LIKE|BETWEEN)\b/i;
    const identifierPattern = /(`\w+`)/;
    const numberPattern = /\b\d+\b/;
    const punctuationPattern = /([\(\),.])/;

    this.formattedQuery = [];

    let tokens = query.split(/\s+/);
    tokens.forEach(token => {
        let tokenClass = '';

        if (token.match(keywordPattern)) tokenClass = 'token keyword';
        else if (token.match(operatorPattern)) tokenClass = 'token keyword';
        else if (token.match(identifierPattern)) tokenClass = 'token identifier';
        else if (token.match(numberPattern)) tokenClass = 'token number';
        else if (token.match(punctuationPattern)) tokenClass = 'token punctuation';
        else tokenClass = 'normal word';

        this.formattedQuery.push({ text: token, class: tokenClass });
    });
    
}

  Clear_query(data){
    if(this.selectedTable == '' || this.selectedTable == undefined || this.selectedTable == null){
      return false;
    }
    this.datacheck = 1
    this.formattedQuery = [];
    this.filters = [];
    this.summarize = [];
    this.groupBy = [];
    this.sorting = [];
    this.joins = [];
    this.select_column = []
    this.limit = 10;
    this.filters_field= [
      { selectedField: '', selectedOperation: '=', selectedValue: '', logicalOperator: 'AND', selectedJoinTable: '' ,sechema_table:'',inputType:'text' }
    ];
    this.joins_field= [{ joinType: this.joinType, selectedTable: '', selectedField: '', joinTable: '', joinField: '' ,sechema_table1:'',sechema_table2:'' }]
    this.sortConditions = [{ selectedJoinTable: '', selectedField: '', selectedOperation: '',sechema_table:'' }];
    this.summarizeConditions = [{ selectedJoinTable: '', selectedField: '', selectedOperation: '',sechema_table:'' }];
    this.groupByConditions = [{ selectedJoinTable: '', selectedField: '' ,sechema_table:""}];
    if(data == 'html'){
      this.onTableSelect();
    }
  }



  handleFieldSelection(event: any) {
    const newSelected = event.value;
    const previousSelected = this.selectedFields;
  
    if (newSelected.includes('*')) {
      if (previousSelected.includes('*')) {
        if (newSelected.length == 2) {
          this.selectedFields = newSelected.filter(item => item !== '*');
        } else {
          this.selectedFields = ['*'];
        }
      } else {
        this.selectedFields = ['*'];
      }
    } else {
      this.selectedFields = newSelected;
    }
  }
  select_column:any[]=[];
  applySelection() {
    if(this.selectedFields.length == 0){
      this.toastr.error("","Please Choose Column")
      return false
    }
    if(this.selectedFields.includes('*')){
      this.select_column = []
    }
    this.select_column = this.select_column.filter(d => !d.table.includes('*'));
    this.select_column.push({
      table: this.selectedFields.includes('*') ? '*' : this.selectedFields.map(field => `${this.sechema_table_select ? this.sechema_table_select : this.schema_name}.${this.selectedJoinTable_select ? this.selectedJoinTable_select : this.selectedTable}.${field}`).join(', ')
    });
  
    this.generateQuery();
    this.closePopup();
  
    // Reset selections
    this.selectedFields = ['*'];
    this.selectedJoinTable_select = '';
  }

  async get_table_fields(filter) {
    if (filter.selectedTable) {
        const newFields = await this.get_table_columns(filter.selectedTable) || [];

        filter._originalFields = [...newFields];
  
        if (!newFields.includes(filter.selectedField)) {
            filter.selectedField = "";  // Reset only if not in the new list
        }
  
        filter.joinTableFields = newFields;
    } else {
        filter.joinTableFields = [];
        filter.selectedField = "";  // Reset field selection if no table is selected
    }
  }

async innerjoin_table_fields(filter) {
  if (filter.selectedJoinTable) {
      const newFields = await this.get_table_columns(filter.selectedJoinTable) || [];

      
      if (!newFields.includes(filter.selectedField)) {
          filter.selectedField = "";  
      }

      filter.filteredJoinTableFields = newFields;
      filter.joinTableFields = newFields;
  } else {
      filter.filteredJoinTableFields = [];
      filter.selectedField = "";  
  }
}


  // filter
  filters_field: any[] = [
    { selectedField: "", selectedOperation: "=", selectedValue: "", logicalOperator: "AND", selectedJoinTable: "",sechema_table:"",inputType:'text'  }
  ];
  addmorefilter() {
    this.filters_field.push({ selectedField: "", selectedOperation: "=", selectedValue: "", logicalOperator: "AND", selectedJoinTable: "",sechema_table:'',inputType:'text'});
}
removeCondition(index: number) {
  this.filters_field.splice(index, 1);
}


  // join
  joins_field: any[] = [{ joinType: this.joinType, selectedTable:'', selectedField: '', joinTable: '', joinField: '',sechema_table1:'',sechema_table2:'' }]

  addMoreJoin() {
    this.joins_field.push({
      joinType: '',
      selectedTable: '',
      selectedField: '',
      joinTable: '',
      joinField: '',
      sechema_table:''
    });
  }
  removeJoin(index: number) {
    this.joins_field.splice(index, 1);
  }
  // sort
  sortConditions: any[] = [{ selectedJoinTable: '', selectedField: '', selectedOperation: '',sechema_table:'' }];

  addMoreSorting() {
    this.sortConditions.push({
      selectedJoinTable: '',
      selectedField: '',
      selectedOperation: '',
      sechema_table:''
    });
  }

  removeSorting(index: number) {
    this.sortConditions.splice(index, 1);
  }
  // summarization
  summarizeConditions: any[] = [{ selectedJoinTable: '', selectedField: '', selectedOperation: '',sechema_table:'' }];

  addMoreSummarization() {
    this.summarizeConditions.push({
      selectedJoinTable: '',
      selectedField: '',
      selectedOperation: '',
      sechema_table:''
    });
  }

  removeSummarization(index: number) {
    this.summarizeConditions.splice(index, 1);
  }

  // groupby
  groupByConditions: any[] = [{ selectedJoinTable: '', selectedField: '',sechema_table:'' }];

  addMoreGroupBy() {
    this.groupByConditions.push({
      selectedJoinTable: '',
      selectedField: '',
      sechema_table:''
    });
  }

  removeGroupBy(index: number) {
    this.groupByConditions.splice(index, 1);
  }

  Go_to_mainscreen(){
    this.qurymain_screen = false;
    this.sqlmainscreen = true;
    this.temp_summary = false;
  }

  // API'S
  Get_tablenames() {
    if((this.sechema_table == '' || this.sechema_table == undefined || this.sechema_table == null) && this.multi_single_scheme == 'Multiple_scheme'){
      this.toastr.error("","Please Choose Schema")
      this.tableKeys = []
      this.jointablekeys = []
      this.jointablekeyssec = []
      return false;
    }
    if(this.tableKeys.length == 0){
      let schema_name = this.schema_name
      this.SpinnerService.show();
      this.dataService.dynamic_tablename(schema_name,this.connection_id)
        .subscribe((results: any[]) => {
          this.SpinnerService.hide();
          this.tableKeys = results['data'][0]['table_names']
          this.jointablekeys = results['data'][0]['table_names']
          this.jointablekeyssec = results['data'][0]['table_names']
        })
    }
  }

  get_table_columns(tablename): Promise<any[]> {
    let schema_name = this.datacheck == 1 ? this.schema_name : this.schema_name_prams;
    let table_name = tablename;
    let type = this.connection_id
    this.SpinnerService.show();
    
    return new Promise((resolve, reject) => {
      this.dataService.dynamic_table_column(schema_name, table_name,type).subscribe(
          (results: any) => {
            this.SpinnerService.hide();
            resolve(results['data'][0]['scheme_names']);
          },
          error => {
            this.SpinnerService.hide();
            console.error('Error fetching columns:', error);
            reject([]);
          }
        );
    });
  }
  
  create_dynamicquery(data){
    if(this.selectedTable == '' || this.selectedTable == undefined || this.selectedTable == null){
      this.toastr.error("","Please Choose Table")
      return false;
    }
    let query
    if (JSON.stringify(this.query_contant.trim()) === JSON.stringify(this.editedQuery.trim())) {
      console.log("Queries are identical");
      query = this.query_contant
  } else {
      console.log("Queries are different");
      this.getFormattedQuery(this.editedQuery);
      query = this.editedQuery
  }
    console.log('final query',query)
    if(this.template_group.value.Template_name == '' || this.template_group.value.Template_name == null || this.template_group.value.Template_name == undefined){
      this.toastr.error("","please Enter Template Name")
      return false
    }
    const trimmedQuery = query.trim().toUpperCase();
    if (!trimmedQuery.startsWith('SELECT')) {
      this.toastr.error("", "Only SELECT queries are allowed.");
      return false;
    }
    let parms = {
      "name":this.template_group.value.Template_name,
      "code":this.template_group.value.Template_name,
      "query_content":query.trim(),
      "rep_data":1,
      "app_flag":1,
      "query_status":1,
      "remark_key":"",
      "status":1,
      "connection_id":this.connection_id
    }
    console.log(parms)
    this.SpinnerService.show();
    this.dataService.dynamic_query_create(parms,this.connection_id)
      .subscribe((results: any) => {
        this.SpinnerService.hide();
        if(results.message == 'Invalid Query Syntax'){
          this.toastr.error('',results.message)
          return false;
        }
        if(results.message == 'Template Name Already Exist'){
          this.toastr.error('',results.message)
          return false;
        }
        if(results.message != 'CREATED SUCCESS'){
          this.toastr.error('',results.message)
          return false;
        }
        this.toastr.success('',results.message)
        this.qurymain_screen = false;
        this.sqlmainscreen = false;
        this.temp_summary = true;
      })
  }

  // searchText: string = '';  
  // filteredTableKeys: string[] = [...this.tableKeys]; // Start with all tables

  // // Call when input changes


  getFilteredtable(): string[] {
    const search = this.selectedTable?.trim() || ''; 
  
    if (!search) {
      return this.tableKeys;
    }
  
    return this.tableKeys.filter(scheme =>
      scheme.toLowerCase().includes(search.toLowerCase())
    );
  }

  public displayStatus(aws_name): string | undefined {
    return aws_name ? aws_name : undefined;
  }
  public displayfield(aws_name): string | undefined {
    return aws_name ? aws_name.column_name : undefined;
  }

  isAnyFilterInvalid() {
  return this.filters_field.some(filter => 
    !filter.selectedField || 
    !filter.selectedOperation || 
    (filter.selectedOperation !== 'IS NULL' && filter.selectedOperation !== 'IS NOT NULL' && !filter.selectedValue)
  );
}

isAnyjoinInvalid() {
  return this.joins_field.some(filter => 
    !filter.joinType || !filter.selectedTable || !filter.selectedField || 
    !filter.joinTable || !filter.joinField 
  );
}

isAnysortInvalid() {
  return this.sortConditions.some(filter => 
    !filter.selectedField || !filter.selectedOperation
  );
}

isAnysummarInvalid() {
  return this.summarizeConditions.some(filter => 
    !filter.selectedField || !filter.selectedOperation
  );
}

isAnygroupInvalid() {
  return this.groupByConditions.some(filter => 
    !filter.selectedField
  );
}

// common filter

gettable_common(data){
  const search = data?.trim() || ''; 

  if (!search) {
    this.jointablekeys =  this.tableKeys;
    return false;
  }else{
    this.jointablekeys = this.tableKeys.filter(scheme =>
      scheme.toLowerCase().includes(search.toLowerCase())
    );
  }
}

gettablesec_common(data){
  const search = data?.trim() || ''; 

  if (!search) {
    this.jointablekeyssec =  this.tableKeys;
    return false;
  }else{
    this.jointablekeyssec = this.tableKeys.filter(scheme =>
      scheme.toLowerCase().includes(search.toLowerCase())
    );
  }
}

getfield_common(data: string, join: any, value: string) {
  const search = data?.trim().toLowerCase() || '';

  if (!join._originalFields) {
      join._originalFields = [...join[value]];
  }

  if (!search) {
      join[value] = [...join._originalFields];
  } else {
      join[value] = join._originalFields.filter(field =>
          field.column_name.toLowerCase().includes(search)
      );
  }
}

getfield_common_sec(data: string, join: any, value: string) {
  const search = data?.trim().toLowerCase() || '';

  if (!join._secoriginalFields) {
      join._secoriginalFields = [...join[value]];
  }

  if (!search) {
      join[value] = [...join._secoriginalFields];
  } else {
      join[value] = join._secoriginalFields.filter(field =>
          field.column_name.toLowerCase().includes(search)
      );
  }
}

joinTableFields: string[] = []; // Columns for the selected join table

updateColumnsForJoinTable(selectedJoinTable) {
  if (selectedJoinTable) {
    // Fetch columns for the selected join table
    this.get_table_columns(selectedJoinTable).then((columns) => {
      this.joinTableFields = columns || [];
      this.selectedFields = ['*']; // Reset to '*' by default
    });
  } else {
    this.joinTableFields = [];
    this.selectedFields = ['*']; // Reset if no join table
  }
}

filteredTables: any[] = [];

filterTables(searchTerm: string) {
  const search = searchTerm?.trim().toLowerCase() || '';

  // Convert Set to Array before filtering
  this.filteredTables = Array.from(this.innerjoin_table).filter(table =>
    table.toLowerCase().includes(search)
  );
}

filteredTables_select: string[] = [];

filterTables_se(searchTerm: string) {
  const search = searchTerm?.trim().toLowerCase() || '';

  // Convert Set to Array before filtering
  this.filteredTables_select = Array.from(this.tableKeys).filter(table =>
    table.toLowerCase().includes(search)
  );
}




filterFields(searchTerm: string, filter) {
  const search = searchTerm?.trim().toLowerCase() || '';

  if (filter.selectedJoinTable) {
    filter.filteredJoinTableFields = filter.joinTableFields.filter(field =>
      field.column_name.toLowerCase().includes(search)
    );
  } else {
    filter.filteredTableFields = this.tableFields.filter(field =>
      field.column_name.toLowerCase().includes(search)
    );
  }
}

validatefun(data):boolean{
  if(data == '' || data == undefined || data == null){
    return false;
  }else{
    return true;
  }
}

preventOpening(selectedJoinTable: any): void {
  if (!this.validatefun(selectedJoinTable)) {
      this.toastr.error("",'Please select a valid table first!')
  }
}

preventOpeningforschema(selectedJoinTable: any): void {
  if (!this.validatefunforschema(selectedJoinTable)) {
      this.toastr.error("",'Please select a valid Schema first!')
  }
}

validatefunforschema(data):boolean{
  if(data == '' || data == undefined || data == null){
    return false;
  }else{
    return true;
  }
}




trackByFn(index: number, item: any): number {
  return index; 
}

updateQuery(event){
  this.editedQuery = (event.target as HTMLElement).textContent?.trim() || '';
  // this.getFormattedQuery(this.editedQuery)
}


// schema point

get_schemas(id){
  this.SpinnerService.show();
  this.pprsharedservice.connection_id.next(id)
  let type = id 
  this.dataService.get_schema_names(id,type)
    .subscribe((results: any[]) => {
      this.SpinnerService.hide();
      this.schema_names_arr = results['data'][0]['scheme_names']
      this.schema_names_arr_popup = results['data'][0]['scheme_names']
      this.schema_names_arr_popup2 = results['data'][0]['scheme_names']
    })
}

schema_selected(schema,data){
  this.tableKeys = []
  this.datacheck = data
  if(data == 1){
    this.schema_name = schema
    this.Get_tablenames()
  }else{
    this.schema_name_prams =  schema
    this.Get_muilty_tablenames()
  }
}
Get_muilty_tablenames() {
  let schema_name = this.schema_name_prams
  this.SpinnerService.show();
  this.dataService.dynamic_tablename(schema_name,this.connection_id)
    .subscribe((results: any[]) => {
      this.SpinnerService.hide();
      this.tableKeys = results['data'][0]['table_names']
      this.jointablekeys = results['data'][0]['table_names']
      this.jointablekeyssec = results['data'][0]['table_names']
    })
}

filterTablesscheme(searchTerm: string, selectedSchema: string) {
  const search = searchTerm?.trim().toLowerCase() || '';

  // Filter tables based on the selected schema and search term
  this.filteredTables = this.filteredTables_temp
    .filter(entry => entry.schema === selectedSchema)  // Keep only tables for the selected schema
    .map(entry => ({
      schema: entry.schema,
      tables: new Set(Array.from(entry.tables).filter(table => 
        (table as string).toLowerCase().includes(search)  // Type assertion for .toLowerCase()
      ))
    }))
    .filter(entry => entry.tables.size > 0);  // Remove entries with empty Sets

  // Flatten the structure to get only the tables as an array
  this.filteredTables = [].concat(...this.filteredTables.map(entry => Array.from(entry.tables)));
}

getFilteredschema(): string[] {
  const search = this.sechema_table?.trim() || ''; 

  if (!search) {
    return this.schema_names_arr;
  }

  return this.schema_names_arr.filter(scheme =>
    scheme.toLowerCase().includes(search.toLowerCase())
  );
}


getFilteredschema_pop(data): string[] {
  const search = data?.trim() || ''; 

  if (!search) {
    return this.schema_names_arr_popup;
  }

  return this.schema_names_arr_popup.filter(scheme =>
    scheme.toLowerCase().includes(search.toLowerCase())
  );
}

getFilteredschema_pop2(data): string[] {
  const search = data?.trim() || ''; 

  if (!search) {
    return this.schema_names_arr_popup2;
  }

  return this.schema_names_arr_popup2.filter(scheme =>
    scheme.toLowerCase().includes(search.toLowerCase())
  );
}

getFilteredschema_pop3(data): string[] {
  const search = data?.trim() || ''; 

  if (!search) {
    return this.innerjoin_table_schemea_pop;
  }

  return this.innerjoin_table_schemea_pop.filter(scheme =>
    scheme.toLowerCase().includes(search.toLowerCase())
  );
}

selecttabele(table){
  // this.selectedTable = table
}
get_field_type(data,filter){
  filter.inputType = data.data_type
}

onDateSelect(firstdate,secondadete,filter){
  let first = this.datepipe.transform(firstdate.value, 'yyyy-MM-dd')
  let second = this.datepipe.transform(secondadete.value, 'yyyy-MM-dd')
  filter.selectedValue = `${first}, ${second}`;

}



}