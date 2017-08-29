// truncate.ts
import {Pipe, PipeTransform} from '@angular/core'
import * as moment from 'moment';

@Pipe({
  name: 'dateFormatter'
})
export class DateFormatterPipe {
  transform(value: string, format: string) : string {
    if(format == 'short_time'){
      return this.formatShortTime(value);
    }

    let dateObj = moment(value);
    if(dateObj.isValid()){
      return dateObj.format(format);
    }
    return value;
  }

  private formatShortTime(time){
    let timeObj = moment(time);
    if(timeObj.isValid()){
      return this.formatShortTimeMinutes(timeObj);
    }

    //moment couldn't convert the time
    //try and convert time (ie. 20:00) to moment
    timeObj = moment(time, 'HH:mm');
    if(timeObj.isValid()){
      return this.formatShortTimeMinutes(timeObj);
    }
    return time;
  }

  private formatShortTimeMinutes(momentObj){
    if(momentObj.format('mm') == '00'){
      return momentObj.format('ha');
    }
    return momentObj.format('h:mma');
  }
}