import { Component, OnInit } from '@angular/core';
import * as moment from 'moment'; // add this 1 of 4

@Component({
  selector: 'datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css']
})
export class DatepickerComponent implements OnInit {
  date = moment();

  ngOnInit():void{
    console.log(this.date.add(7, 'days').format()); // add this 4of 4
    //get current month and year
  }

  public addMonth(){
    this.date.add(1, "month");
  }

  public subtractMonth(){
    this.date.subtract(1,"month");
  }

  private drawCal() {
    let daysInMonth = this.date.daysInMonth();
    let monthStartDay = this.date.startOf('month');
    /*
    //shift first row by month start date
    for (var i = 1; i <= +monthStartDay; i++) {
      var $day = "<td></td>";
      $("#cal tr:last").append($day);
    }
    
    //for each day, append a td to the row
    for (var i = 1; i <= daysInMonth; i++) {
      var $day = "<td><a>" + (i) + "</a></td>";
      $("#cal tr:last").append($day);

      //if day 7 (w/shift), append row contaning 7 days to tbody and clear row
      if ((i + monthStartDays) % 7 == 0 & i != 0) {
        $("#cal").append($rowOut);
        $rowOut = "<tr></tr>";
        $("#cal").append($rowOut);
      }
    }
    */
  }
}
