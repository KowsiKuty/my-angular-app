import { Directive, HostListener, ElementRef, Renderer2, Optional} from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appCleardirective]'
})
export class CleardirectiveDirective {

 private clearedThisFocus = false;

  constructor(
    private el: ElementRef<HTMLInputElement | HTMLTextAreaElement>,
    private renderer: Renderer2,
    @Optional() private control: NgControl   // optional so it works even without a form control
  ) {}

  // Clear when user focuses OR clicks the field
  @HostListener('focusin') onFocusIn() {
    this.clearOncePerFocus();
  }

  @HostListener('click') onClick() {
    this.clearOncePerFocus();
  }

  // Reset the one-time-per-focus guard when leaving the field
  @HostListener('focusout') onFocusOut() {
    this.clearedThisFocus = false;
  }

  private clearOncePerFocus() {
    if (this.clearedThisFocus) return;

    // Clear the DOM value
    this.renderer.setProperty(this.el.nativeElement, 'value', '');

    // Keep Angular forms in sync
    if (this.control?.control) {
      this.control.control.setValue('');
      this.control.control.markAsDirty();
      this.control.control.markAsTouched();
      this.control.control.updateValueAndValidity({ emitEvent: true });
    } else {
      // If not bound to a form control, emit an input event so Angular change detection sees it
      this.el.nativeElement.dispatchEvent(new Event('input', { bubbles: true }));
    }

    this.clearedThisFocus = true;
  }
}
// export class ClearOnFocusDirective {
//   private clearedThisFocus = false;

//   constructor(
//     private el: ElementRef<HTMLInputElement | HTMLTextAreaElement>,
//     private renderer: Renderer2,
//     @Optional() private control: NgControl   // optional so it works even without a form control
//   ) {}

//   // Clear when user focuses OR clicks the field
//   @HostListener('focusin') onFocusIn() {
//     this.clearOncePerFocus();
//   }

//   @HostListener('click') onClick() {
//     this.clearOncePerFocus();
//   }

//   // Reset the one-time-per-focus guard when leaving the field
//   @HostListener('focusout') onFocusOut() {
//     this.clearedThisFocus = false;
//   }

//   private clearOncePerFocus() {
//     if (this.clearedThisFocus) return;

//     // Clear the DOM value
//     this.renderer.setProperty(this.el.nativeElement, 'value', '');

//     // Keep Angular forms in sync
//     if (this.control?.control) {
//       this.control.control.setValue('');
//       this.control.control.markAsDirty();
//       this.control.control.markAsTouched();
//       this.control.control.updateValueAndValidity({ emitEvent: true });
//     } else {
//       // If not bound to a form control, emit an input event so Angular change detection sees it
//       this.el.nativeElement.dispatchEvent(new Event('input', { bubbles: true }));
//     }

//     this.clearedThisFocus = true;
//   }
// }

