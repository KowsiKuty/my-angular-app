import { Directive, ElementRef, OnInit, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Directive({
  selector: '[appResizable]' // Attribute selector
})

export class AppResizeableDirective implements OnInit {


  @Input() resizableGrabWidth = 10;
  @Input() resizableMinWidth = 20;

  dragging = false;

  constructor(private el: ElementRef,private snackbar :MatSnackBar) {

    const self = this;

    const EventListenerMode = { capture: true };

    function preventGlobalMouseEvents() {
      document.body.style['pointer-events'] = 'none';
    }

    function restoreGlobalMouseEvents() {
      document.body.style['pointer-events'] = 'auto';
    }


    const newWidth = (wid) => {
      const newWidth = Math.max(this.resizableMinWidth, wid);
      el.nativeElement.style.width = (newWidth) + "px";
    }


    const mouseMoveG = (evt) => {
      if (!this.dragging) {
        return;
      }
      // console.log("EVT",evt)
      // console.log("Element",el.nativeElement.offsetLeft)
      let width = evt.clientX - el.nativeElement.offsetLeft
      if(width < 600){
        width = 600;
        // this.snackbar.open('Maximum Resizable Limit Reached','Ok')
      }
      // else{
  
      // }
      // else if (width < 500){
      //   width = 500;
      //   this.snackbar.open('Minimum Resizable Limit Reached','Ok')
      // }
      newWidth(width)
      evt.stopPropagation();
    };

    // const dragMoveG = (evt) => {
    //   if (!this.dragging) {
    //     return;
    //   }
    //   const newWidth = Math.max(this.resizableMinWidth, (evt.clientX - el.nativeElement.offsetLeft)) + "px";
    //   el.nativeElement.style.width = (evt.clientX - el.nativeElement.offsetLeft) + "px";
    //   evt.stopPropagation();
    // };

    const mouseUpG = (evt) => {
      if (!this.dragging) {
        return;
      }
      restoreGlobalMouseEvents();
      this.dragging = false;
      evt.stopPropagation();
    };

    const mouseDown = (evt) => {
      if (this.inDragRegion(evt)) {
        this.dragging = true;
        preventGlobalMouseEvents();
        evt.stopPropagation();
      }
    };


    const mouseMove = (evt) => {
      if (this.inDragRegion(evt) || this.dragging) {
        el.nativeElement.style.cursor = "col-resize";
      } else {
        el.nativeElement.style.cursor = "default";
      }
    }


    document.addEventListener('mousemove', mouseMoveG, true);
    document.addEventListener('mouseup', mouseUpG, true);
    el.nativeElement.addEventListener('mousedown', mouseDown, true);
    el.nativeElement.addEventListener('mousemove', mouseMove, true);
  }

  ngOnInit(): void {
    this.el.nativeElement.style["border-right"] = this.resizableGrabWidth + "px solid whitesmoke";
    this.el.nativeElement.style["z-index"]=1;
  }

  inDragRegion(evt) {
    return this.el.nativeElement.clientWidth - evt.clientX + this.el.nativeElement.offsetLeft < this.resizableGrabWidth;
  }

}
