import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateRefine'
})
export class DateRefinePipe implements PipeTransform {

  transform(value: string) : string {
    let hours = value.slice(-5, -3);
    if (hours === '24') {
      return value.slice(0, -5) + '00' + value.slice(-3);
    }
    return value;
  };

}
