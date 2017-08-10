import { Venue } from './venue';

export class Event {
  id: number;
  backgroundUrl:string;
  //city:string;
  public:boolean = true;
  confirmed:boolean;
  createdAt:string;
  createdBy:number;
  description:string;
  end:string;
  imageUrl:string;
  //lat:string;
  //lng:string;
  distance:number;
  location:string;
  name:string;
  participants:any;
  participantsjson:any;
  postalCode:string;
  start:string;
  startTime:any;
  localTz:any;
  localStart:any;
  localEnd:any;
  startDate:any;
  state:string;
  streetAddress:string;
  updatedAt:string;
  updatedBy:number;
  venue: Venue;
  venueId:number;
  venueName:string;
  tagline:string;
  categories:any;
  categoriesJson:any;
  friendsAttendingYes:any;
  friendsAttendingYesCount:number;
  attendingYesCount:number;

  public static arrayMap(json):Event[]{
    let events:Event[] = [];
    if(typeof json === 'object'){
      //An object was passed in
      for(let index in json){
        let position = parseInt(index); //convert the index:String to a number
        let event = json[position]
        let eventObj = this.map(event);
        events.push(eventObj);
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
    //currentEvent.city = json.city;
    currentEvent.confirmed = json.confirmed;
    currentEvent.createdAt = json.created_at;
    currentEvent.createdBy = json.created_by;
    currentEvent.description = json.description;
    currentEvent.end = json.end;
    currentEvent.imageUrl = json.imageurl;
    //currentEvent.lat = json.lat;
    //currentEvent.lng = json.lng;
    currentEvent.distance = json.distance;
    currentEvent.location = json.location;
    currentEvent.name = json.name;
    currentEvent.participants = JSON.parse(json.participantsjson);
    currentEvent.participantsjson = json.participantsjson;
    currentEvent.postalCode = json.postalcode;
    currentEvent.public = json.public;
    currentEvent.start = json.start;
    currentEvent.state = json.state;
    currentEvent.streetAddress = json.street_address;
    currentEvent.updatedAt = json.updated_at;
    currentEvent.updatedBy = json.updated_by;
    currentEvent.localTz = json.local_tz;
    currentEvent.localStart = json.local_start;
    currentEvent.localEnd = json.local_end;
    currentEvent.venue = json.venue && Venue.map(json.venue);
    currentEvent.venueId = json.venue_id;
    currentEvent.venueName = json.venue_name;
    currentEvent.tagline = json.tagline;
    currentEvent.categories = JSON.parse(json.categoriesjson);
    currentEvent.categoriesJson = json.categoriesjson;
    currentEvent.friendsAttendingYes = json.friendsattendingyes;
    currentEvent.friendsAttendingYesCount = json.friendsattendingyes_count;
    currentEvent.attendingYesCount = json.attendingyes_count;
    return currentEvent;
  }
}