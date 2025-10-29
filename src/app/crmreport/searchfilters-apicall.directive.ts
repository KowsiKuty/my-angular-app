import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appSearchfiltersApicall]'
})
export class SearchfiltersApicallDirective {

  constructor() { }

  @Input('getsearchinfo') searchinfo:any 

  @HostListener('keyup') onkeypress(){
    console.log('this.searchinfos',this.searchinfo)
  }

}
