// truncate.ts
import {Pipe, PipeTransform} from '@angular/core'
import * as moment from 'moment';

@Pipe({
  name: 'dateFormatter'
})
export class DateFormatterPipe {
  transform(value: string, format: string) : string {
    let dateObj = moment(value);
    return dateObj.format(format);
  }
}