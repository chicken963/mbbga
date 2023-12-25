import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'date'
})
export class DatePipe implements PipeTransform {

  transform(value: Date) : string;
  transform(value: string) : string;
  transform(value: any): string {
    if (typeof value === 'string') {
      return this.formatString(value)
    } else {
      return this.formatDate(value)
    }
  }

  formatString(date: string): string {
    const localDateTime = new Date(date);
    return this.formatDate(localDateTime);
  }

  formatDate(date: Date): string {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false
    });
  }

}
