import { Venue } from './venue';

export class Event {
  id: number;
  backgroundUrl:string;
  city:string;
  confirmed:number;
  createdAt:string;
  createdBy:number;
  description:string;
  end:string;
  imageUrl:string;
  lat:string;
  lng:string;
  location:string;
  name:string;
  //particapants: TODO: make a model for this
  postalCode:string;
  public:number;
  start:string;
  state:string;
  streetAddress:string;
  updatedAt:string;
  updatedBy:number;
  venue: Venue;
  venueId:number;
  venueName:string;
  venueTagline:string;

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
    currentEvent.backgroundUrl = json.backgroundurl;
    currentEvent.city = json.city;
    currentEvent.confirmed = json.confirmed;
    currentEvent.createdAt = json.created_at;
    currentEvent.createdBy = json.created_by;
    currentEvent.description = json.description;
    currentEvent.end = json.end;
    currentEvent.imageUrl = json.imageurl;
    currentEvent.lat = json.lat;
    currentEvent.lng = json.lng;
    currentEvent.location = json.location;
    currentEvent.name = json.name;
    //currentEvent.particapants TODO: fix this
    currentEvent.postalCode = json.postalcode;
    currentEvent.public = json.public;
    currentEvent.start = json.start;
    currentEvent.state = json.state;
    currentEvent.streetAddress = json.street_address;
    currentEvent.updatedAt = json.updated_at;
    currentEvent.updatedBy = json.updated_by;
    currentEvent.venue = json.venue && Venue.map(json.venue);
    currentEvent.venueId = json.venue_id;
    currentEvent.venueName = json.venue_name;
    currentEvent.venueTagline = json.tagline;
    return currentEvent;
  }
}