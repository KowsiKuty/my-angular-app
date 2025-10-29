// import { Pipe, PipeTransform } from '@angular/core';

// @Pipe({
//   name: 'amountPipeCustom'
// })
// export class AmountPipeCustomPipe implements PipeTransform {

//   transform(value: number | string, locale?: string): string {
//     return new Intl.NumberFormat(('en-IN'), {
//       minimumFractionDigits: 2,
//       style: 'currency', currency: 'INR'
//     }).format(Number(value));
//   }

// }
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'amountPipeCustom'
})
export class AmountPipeCustomPipe implements PipeTransform {
  transform(value: number | string): string {
    if (value === null || value === undefined || value === '') return '';

    // Convert to string and remove commas
    let strVal = value.toString().replace(/,/g, '');

    // Not a valid number → just return back what user typed
    if (isNaN(Number(strVal))) return strVal;

    const num = Number(strVal);

    // 👉 Count decimals typed
    let decimals = (strVal.split('.')[1] || '').length;

    // 👉 Cap decimals at 2
    if (decimals > 2) decimals = 2;

    // ✅ Format with Indian style commas and up to 2 decimals
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: 2
    }).format(num);
  }
}





