// truncate.ts
import {Pipe, PipeTransform} from '@angular/core'

@Pipe({
  name: 'truncate'
})
export class TruncatePipe {
  transform(value: string, args: string[]) : string {
    let limit = args.length > 0 ? parseInt(args[0], 10) : 10;
    let trail = args.length > 1 ? args[1] : '...';
    let hardBreak = args.length > 2 ? args[2] : 8;

    let breakPosition = value.indexOf(' ', limit);
    if(breakPosition < 0){ 
      breakPosition = value.length;
    }
    if(breakPosition > limit + +hardBreak){ //hard break
      breakPosition = limit;
    }
    let substring = value.substring(0, breakPosition);
    return substring.length < value.length ? substring + trail : substring;
  }
}