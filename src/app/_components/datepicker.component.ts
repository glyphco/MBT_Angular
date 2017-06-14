import { Component, OnInit } from '@angular/core';
import * as moment from 'moment'; // add this 1 of 4

@Component({
  selector: 'datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css']
})
export class DatepickerComponent implements OnInit {
  date = moment();
  monthDays = [];

  ngOnInit():void{
    //get current month and year
    this.updateMonthDays();
  }

  public addMonth(){
    this.date.add(1, "month");
    this.updateMonthDays();
  }

  public subtractMonth(){
    this.date.subtract(1,"month");
    this.updateMonthDays();
  }

  private updateMonthDays(){
    let year = this.date.format('YYYY');
    let month = this.date.format('M');
    let daysArray = this.getDaysOfMonth(year, month);
    this.monthDays = this.arrayAllDays(daysArray,year,month);
  }
  //Step 1
  private getDaysOfMonth(year, month) {
    year = +year;
    month = +month;
    var offsets = [ 0, 1, 2, 3, 4, 5, 6 ];
    var date = new Date(year, month-1, 1);
    var result = [];
    while (date.getMonth() == month-1) {
      var dateObj= {
        offset: offsets[date.getDay()],
        day: date.getDate()
      }
      result.push(dateObj);
      date.setDate(date.getDate()+1);
    }
    return result;
  }
  //Step 2
  private arrayAllDays(daysArray,year:string,month:string){
    let offset = daysArray[0].offset;
    //already starts on first day
    if(offset == 0){
      return this.formattedMonth(daysArray);
    }
    let lastMonthDays = moment(`${year}-${month}`, "YYYY-MM").subtract(1,'month').daysInMonth()
    //take the days from last month and pad beginning of calendar
    for(let i=0;i < offset;i++){
      let tempObj = {
        day:lastMonthDays,
        inactive:true
      }
      daysArray.unshift(tempObj);
      lastMonthDays--;
    }
    return this.formattedMonth(daysArray);
  }
  //Step 4
  private formattedMonth(daysArray){
    let returnArray = [];
    //create new array grouping each day into weeks
    for(let n=0;n < 5;n++){
      let tempArray = [];
      let x = 0;
      for(let x=0;x < 7;x++){
        if(daysArray.length > 0){
          tempArray.push(daysArray.shift());
        }
      }
      returnArray.push(tempArray);
    }
    return returnArray;
  }
}
