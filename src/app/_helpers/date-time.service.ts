import * as moment from 'moment-timezone';

export class DateTime {
  private _dateTime = new moment().tz('America/Los_Angeles');
  private _timezoneId = 'America/Los_Angeles'; //default

  constructor(dateTime=null, timezone=null){
    if(dateTime && timezone){
      this._dateTime = new moment(dateTime).tz(timezone);
      this._timezoneId = timezone;
    }
  }

  get date() {
    return this._dateTime;
  }
  set date(newDate){
    let year = newDate.getFullYear();
    let month = newDate.getMonth();
    let date = newDate.getDate();
    this._dateTime.year(year).month(month).date(date);
  }
  get time() {
    return this._dateTime.format('HH:mm');
  }
  set time(newTime) {
    let timeArray = newTime.split(':');
    let hours = timeArray[0];
    let minutes = timeArray[1];
    this._dateTime.hours(hours).minutes(minutes);
  }
  get timezone() {
    return this._dateTime.format('z');
    //return this.dateTime.tz.name;
  }
  set timezone(newTimezone:string) {
    this._dateTime.tz(newTimezone);
    this._timezoneId = newTimezone;
  }
  get timezoneId() {
    return this._timezoneId;
  }
}