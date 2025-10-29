import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { CbdaserviceService } from "../cbdaservice.service";
import { MatChipInputEvent } from "@angular/material/chips";
  
@Component({
  selector: 'app-mappingmaster-cbda',
  templateUrl: './mappingmaster-cbda.component.html',
  styleUrls: ['./mappingmaster-cbda.component.scss']
})
export class MappingmasterCbdaComponent implements OnInit {

  constructor(private cbdaservice:CbdaserviceService) { }

  ngOnInit(): void {
  }
  SearchBool:boolean=true
  CreateBool:boolean=false
  SearchForm=new FormGroup({
    Column:new FormControl()
  })

  dynamicdatas: any[] = [];
  
     response: any = {
    data: [
      {
        column: 'column3',
        mappings: [
          {
            From: { id: 1, field: 'GL' },
            To: { id: 1, field: 'GL' },
          },
          {
            From: { id: 2, field: 'Product' },
            To: { id: 2, field: 'Product' },
          },
        ],
      },
      {
        column: 'column6',
        mappings: [
          {
            From: { id: 2, field: 'Product' },
            To: { id: 2, field: 'Product' },
          },
          {
            From: { id: 1, field: 'GL' },
            To: { id: 2, field: 'Product' },
          },
        ],
      },
      {
        column: 'column8',
        mappings: [
          {
            From: { id: 1, field: 'GL' },
            To: { id: 1, field: 'GL' },
          },
        ],
      },
    ],
  };

   selectedColumn = '';
  selectedMappings: any[] = [];

onColumnChange(columnName: string) {
  this.selectedColumn = columnName;
  const selectedColObj = this.response.data.find((col: any) => col.column === columnName);
  this.selectedMappings = selectedColObj ? selectedColObj.mappings : [];

  // Initialize chip arrays
  this.selectedMappings.forEach(map => {
    map.From.selectedOptions = [];
    map.To.selectedOptions = [];
  });
}

isLoading = false;
// dynamicdatas: any[] = [];

onFieldChange(selectedValue: string) {
  this.isLoading = true; // start loading

  let request$;

  if (selectedValue === 'Branch') {
    request$ = this.cbdaservice.branchdd();
  } else if (selectedValue === 'Product') {
    request$ = this.cbdaservice.productdd();
  } else if (selectedValue === 'GL') {
    request$ = this.cbdaservice.gldd();
  }

  if (request$) {
    request$.subscribe({
      next: (res) => {
        this.dynamicdatas = res.data;
        this.isLoading = false; // stop loading
      },
      error: () => {
        this.isLoading = false; // stop loading even on error
      },
    });
  }
}


selectChip(event: MatAutocompleteSelectedEvent, target: any) {
  target.selectedOptions.push(event.option.value);
}

addChip(event: MatChipInputEvent, target: any) {
  const input = event.input;
  const value = event.value;
  if ((value || '').trim()) {
    target.selectedOptions.push({ name: value.trim() });
  }
  if (input) {
    input.value = '';
  }
}

removeChip(chipList: any[], chip: any) {
  const index = chipList.indexOf(chip);
  if (index >= 0) {
    chipList.splice(index, 1);
  }
}

}
