import { Directive, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { EditableModalComponent } from './editable-modal/editable-modal.component';

import { MatDialog } from '@angular/material/dialog';
@Directive({
  selector: '[appEditable]'
})
export class EditableDirective implements OnInit {

  @Input('appEditable') formObject: any;

  constructor(private el: ElementRef, private renderer: Renderer2, private dialog: MatDialog) {
    this.renderer.appendChild(this.btn, this.icon);
  }
  btn: ElementRef = this.renderer.createElement('span')
  icon = this.renderer.createText('edit')

  ngAfterViewInit() {


    this.renderer.listen(this.el.nativeElement, "mouseover", (event) => {

      this.onMouseOver()
    })
    this.renderer.listen(this.el.nativeElement.parentNode, "mouseleave", (event) => {
      this.onMouseLeave()
    })

    this.renderer.listen(this.btn, "click", () => {
      this.edit()
    })
  }



  ngOnInit(): void {

  }

  dialogRef
  edit() {
    // this.renderer.setProperty(this.el.nativeElement, "contentEditable", "true")

    // console.log("hits")
    this.dialogRef = this.dialog.open(EditableModalComponent, {
      disableClose: true,
      width: "30em",
      // height:"500px",
      panelClass: 'mat-container',
      data: this.formObject
    }).afterClosed().subscribe(result => {
      console.log('hits')
      if (result) {

      }
    })
  }

  closeModal(){
    this.dialogRef.close()
  }
  notEditable = false;

  onMouseOver() {
    if (!this.formObject.key) {
      console.log('not Editable invalid key')
      return
    }
    this.renderer.addClass(this.el.nativeElement, 'border')
    this.renderer.addClass(this.btn, "material-icons")
    this.renderer.addClass(this.btn, "editBtn")
    // this.renderer.setAttribute(this.btn, "placement", "bottom")
    // this.renderer.setAttribute(this.btn, "ngbPopover", "Checking")
    // this.renderer.setAttribute(this.btn, "popoverTitle", "VAlue")
    // console.log(this.btn)
    this.renderer.appendChild(this.el.nativeElement, this.btn)
    // this.renderer.insertBefore(this.el.nativeElement.parentNode, this.btn, this.el.nativeElement)
  }

  onMouseLeave() {

    this.renderer.removeClass(this.el.nativeElement, 'border')
    this.renderer.removeChild(this.el.nativeElement, this.btn)
  }

}



