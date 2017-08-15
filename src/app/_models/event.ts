import { Venue } from './venue';

export class Event {
  id: number;
  backgroundUrl:string;
  city:string;
  public:boolean = true;
  confirmed:boolean;
  createdAt:string;
  createdBy:number;
  description:string;
  end:string;
  imageUrl:string;
  lat:number;
  lng:number;
  distance:number;
  location:string;
  name:string;
  participants:any;
  participantspivot = [];
  showspivot = [];
  shows:any;
  producerspivot = [];
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
  venueTagline:string;
  tagline:string;
  categories = [];
  categoriesJson:any;
  friendsAttendingYes:any;
  friendsAttendingYesCount:number;
  attendingYesCount:number;

  //TODO: map these
  mveId:number;
  ages:number;
  info:string;
  privateInfo:string;
  price:number
  priceMin:number;
  priceMax:number;
  priceDescription:string;
  priceLink:string;

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
    currentEvent.city = json.city;
    currentEvent.confirmed = json.confirmed;
    currentEvent.createdAt = json.created_at;
    currentEvent.createdBy = json.created_by;
    currentEvent.description = json.description;
    currentEvent.end = json.end;
    currentEvent.imageUrl = json.imageurl;
    currentEvent.lat = +json.lat;
    currentEvent.lng = +json.lng;
    currentEvent.distance = json.distance;
    currentEvent.location = json.location;
    currentEvent.name = json.name;

    //currentEvent.participantspivot = json.eventparticipants;


    currentEvent.participants = JSON.parse(json.participantsjson);
    currentEvent.participantspivot = ParticipantPivot.arrayMap(json.eventparticipants);
    currentEvent.showspivot = json.eventshows;    
    currentEvent.shows = JSON.parse(json.showsjson);
    //currentEvent.producerspivot = ProducersPivot.arrayMap(json.eventproducer);    
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
    currentEvent.venueTagline = json.venue_tagline;
    currentEvent.tagline = json.tagline;
    currentEvent.categories = JSON.parse(json.categoriesjson);
    currentEvent.categoriesJson = json.categoriesjson;
    currentEvent.friendsAttendingYes = json.friendsattendingyes;
    currentEvent.friendsAttendingYesCount = json.friendsattendingyes_count;
    currentEvent.attendingYesCount = json.attendingyes_count;
    return currentEvent;
  }
}

/*------------------------------------------------------
  PIVOT MODELS
------------------------------------------------------*/

class ParticipantPivot {
  eventId:number;
  pageId:number;
  name:string;
  info:string;
  privateInfo:string;
  imageUrl:string;
  start:any;
  end:any;
  order:number;
  public:boolean;
  confirmed:boolean;

  public static arrayMap(json):ParticipantPivot[]{
    let participants:ParticipantPivot[] = [];
    if(!json){
      return [];
    }
    //json = JSON.parse(json);
    //An object was passed in
    for(let participant of json){
      let participantObj = this.map(participant);
      participants.push(participantObj);
    }
    return participants;
  }

  public static map(json):ParticipantPivot{
    let currentParticipant = new ParticipantPivot();
    currentParticipant.eventId = json.event_id;
    currentParticipant.pageId = json.page_id;
    currentParticipant.name = json.name;
    currentParticipant.info = json.info;
    currentParticipant.privateInfo = json.private_info;
    currentParticipant.imageUrl = json.imageurl;
    currentParticipant.start = json.start;
    currentParticipant.end = json.end;
    currentParticipant.order = json.order;
    currentParticipant.public = json.public;
    currentParticipant.confirmed = json.confirmed;
    return currentParticipant;
  }
}

class ProducersPivot {
  eventId:number;
  pageId:number;
  name:string;
  info:string;
  privateInfo:string;
  imageUrl:string;
  order:number;
  public:boolean;
  confirmed:boolean;
}

class ShowsPivot {
  eventId:number;
  pageId:number;
  name:string;
  info:string;
  imageUrl:string;
  order:number;
}