import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'dateTimeFormat'
})
export class DateTimeFormatPipe implements PipeTransform {
  constructor() {}

  transform(value: Date | string): string {
    moment.locale('hu');
    return value
      ? [
          moment(value)
            .local()
            .format('L'),
          moment(value)
            .local()
            .format('LT')
        ].join(' ')
      : 'n.a.';
  }
}
