import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { NotificationService } from './notification.service';

@Directive({
  selector: '[appAmountNotification]'
})
export class AmountNotificationDirective {
  @Input('amount') amounts: {
    claimedamount: any,
    eligibleamount: any,
  }
  constructor(private elementRef: ElementRef, private renderer: Renderer2, private notification: NotificationService) {
  }

  ngOnInit() {

    this.renderer.listen(this.elementRef.nativeElement, "keyup", event => {
      if (this.amounts.claimedamount > this.amounts.eligibleamount) {
        this.notification.showWarning('Entered Amount is more than the Eligible Amount..')
      }
    })
  }



}
