// truncate.ts
import {Pipe, PipeTransform} from '@angular/core'
import * as moment from 'moment';

@Pipe({
  name: 'dateFormatter'
})
export class DateFormatterPipe {
  transform(value: string, format: string) : string {
    let dateObj = moment(value);
    if(format == 'short_time'){
      if(dateObj.format('mm') == '00'){
        return dateObj.format('ha');
      }
      return dateObj.format('h:mma');
    }
    return dateObj.format(format);
  }
}