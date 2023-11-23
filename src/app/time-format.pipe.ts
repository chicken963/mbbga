import { Pipe, PipeTransform } from '@angular/core';
import {TimeConversionService} from "./time-conversion.service";

@Pipe({
  name: 'timeFormat'
})
export class TimeFormatPipe implements PipeTransform {

  constructor(private timeConversionService: TimeConversionService) {}

  transform(value: any, format: 'numeric' | 'string'): any {
    if (format === 'numeric') {
      return this.timeConversionService.stringToSeconds(value);
    } else {
      return this.timeConversionService.secondsToString(value);
    }
  }

}
