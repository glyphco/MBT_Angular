import { Venue } from './venue';
//MARK: I didn't feel like modeling this, I'll do it later
export class Event {
  id:number;
  venueName:string;
  streetAddress:string;
  city:string;
  state:string;
  postalcode:string;


  public static arrayMap(json):Event[]{
    let events:Event[] = [];
    if(typeof json === 'object'){
      //An object was passed in
      for(let index in json){
        let position = parseInt(index); //convert the index:String to a number
        if(position){
          let event = json[position]
          let eventObj = this.map(event);
          events.push(eventObj);
        }
      }
    }else{ //An array was passed in
      for (let event of json as any[]){
        let eventList = this.map(event);
        events.push(eventList);
      }
    }
    return events;
  }

  public static map(json):Event{
    let currentEvent = new Event();
    currentEvent.id = json.id;
    return currentEvent;
  }
}