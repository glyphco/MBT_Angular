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
  imageIcon:string;
  imageSm:string;
  imageLg:string;
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
  venueImageUrl:string;
  venueImageIcon:string;
  venueImageSm:string;
  venueImageLg:string;
  tagline:string;
  categories = [];
  categoriesJson:any;
  pyfsAttendingYesList = []
  pyfsAttendingYesCount = 0;
  attendingYesCount = 0;
  iattending:any;

  //TODO: map these
  mveId:number;
  privateInfo:string;
  ages = 0;
  agesWord = '';
  agesIcon = '';
  price = 0;
  priceWord = '';
  priceMin:number;
  priceMax:number;
  priceMinMax:string;
  priceDescription:string;
  priceLink:string;

  public static arrayMap(json):Event[]{
    let events:Event[] = [];
    if(!json){
      return [];
    }
    for(let event of json){
      let eventObj = this.map(event);
      events.push(eventObj);
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
    if ( currentEvent.imageUrl != null) { //
      currentEvent.imageIcon = currentEvent.imageUrl.replace(/\.[^/.]+$/, "") + "_icon.jpg";
      currentEvent.imageSm = currentEvent.imageUrl.replace(/\.[^/.]+$/, "") + "_sm.jpg";
      currentEvent.imageLg = currentEvent.imageUrl.replace(/\.[^/.]+$/, "") + "_lg.jpg";
    }
    currentEvent.lat = +json.lat;
    currentEvent.lng = +json.lng;
    currentEvent.distance = json.distance;
    currentEvent.location = json.location;
    currentEvent.name = json.name;

    currentEvent.participants = ParticipantPivot.arrayMap(JSON.parse(json.participantsjson));
    currentEvent.participantspivot = ParticipantPivot.arrayMap(json.eventparticipants);

    currentEvent.shows = ShowPivot.arrayMap(JSON.parse(json.showsjson));  
    currentEvent.showspivot = ShowPivot.arrayMap(json.eventshows);    
 
    currentEvent.producerspivot = ProducerPivot.arrayMap(json.eventproducers);

    currentEvent.categories = JSON.parse(json.categoriesjson);
    currentEvent.categoriesJson = json.categoriesjson; 

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
    currentEvent.venueImageUrl = json.venue_imageurl;
    if ( currentEvent.venueImageUrl != null) { //
      currentEvent.venueImageIcon = currentEvent.venueImageUrl.replace(/\.[^/.]+$/, "") + "_icon.jpg";
      currentEvent.venueImageSm = currentEvent.venueImageUrl.replace(/\.[^/.]+$/, "") + "_sm.jpg";
      currentEvent.venueImageLg = currentEvent.venueImageUrl.replace(/\.[^/.]+$/, "") + "_lg.jpg";
    }
    currentEvent.tagline = json.tagline;

    currentEvent.ages = json.ages;
    switch(currentEvent.ages) {
        case 0:
            currentEvent.agesWord = '';
            currentEvent.agesIcon = '';
            break;
        case 1:
            currentEvent.agesWord = 'family';
            //This didnt work :(
            currentEvent.agesIcon = '<span class=\"fa-stack\"><i class=\"fa fa-male fa-stack-1x\" style="left: -4px;\"></i><i class=\"fa fa-male fa-stack-1x\" style="font-size: .75em; left: 2px;top: 2px;\"></i><i class=\"fa fa-female fa-stack-1x\" style="left: 8px;\"></i></span>';
            currentEvent.agesIcon = '';
            break;
        case 2:
            currentEvent.agesWord = 'all ages';
            currentEvent.agesIcon = '';
            break;
        case 3:
            currentEvent.agesWord = '18+';
            currentEvent.agesIcon = '';
            break;
        case 4:
            currentEvent.agesWord = '21+';
            currentEvent.agesIcon = '';
            break;
        default:
            currentEvent.agesWord = '';
            currentEvent.agesIcon = '';
    }


    currentEvent.price = json.price;
    switch(currentEvent.price) {
        case 0:
            currentEvent.priceWord = '';
            break;
        case 1:
            currentEvent.priceWord = 'free';
            break;
        case 2:
            currentEvent.priceWord = 'donation';
            break;
        case 3:
            currentEvent.priceWord = 'sliding';
            break;
        default:
            currentEvent.priceWord = '';
    }

    currentEvent.priceMin = json.pricemin;
    currentEvent.priceMax = json.pricemax;

    //This makes a dummy-proof price line
    if (( currentEvent.priceMax != null) && (currentEvent.priceMin > currentEvent.priceMax)) { //swap 'em
      currentEvent.priceMin = currentEvent.priceMax + (currentEvent.priceMax = currentEvent.priceMin, 0);
    }
    currentEvent.priceMinMax = '';
    if (currentEvent.priceMin != null){
      currentEvent.priceMinMax = '$' + currentEvent.priceMin;
      if ((currentEvent.priceMax != null) && (currentEvent.priceMax != currentEvent.priceMin) && (currentEvent.priceMax != 0)) {
        currentEvent.priceMinMax += ' - $' + currentEvent.priceMax;
      }
    }
    if ((currentEvent.priceMin == 0) && (currentEvent.priceMax == 0)) {
      currentEvent.priceMinMax = '';
    }

    currentEvent.priceDescription = json.pricedescription;
    currentEvent.priceLink = json.pricelink;

    currentEvent.pyfsAttendingYesList = json.pyfsattendingyes_list;
    currentEvent.pyfsAttendingYesCount = json.pyfsattendingyes_count;
    currentEvent.attendingYesCount = json.attendingyes_count;
    currentEvent.iattending = json.iattending ? json.iattending[0] : undefined;
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
  imageIcon:string;
  imageSm:string;
  imageLg:string;
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
    if ( currentParticipant.imageUrl != null) { //
      currentParticipant.imageIcon = currentParticipant.imageUrl.replace(/\.[^/.]+$/, "") + "_icon.jpg";
      currentParticipant.imageSm = currentParticipant.imageUrl.replace(/\.[^/.]+$/, "") + "_sm.jpg";
      currentParticipant.imageLg = currentParticipant.imageUrl.replace(/\.[^/.]+$/, "") + "_lg.jpg";
    }
    currentParticipant.start = json.start;
    currentParticipant.end = json.end;
    currentParticipant.order = json.order;
    currentParticipant.public = json.public;
    currentParticipant.confirmed = json.confirmed;
    return currentParticipant;
  }
}

class ProducerPivot {
  eventId:number;
  pageId:number;
  name:string;
  info:string;
  privateInfo:string;
  imageUrl:string;
  imageIcon:string;
  imageSm:string;
  imageLg:string;
  order:number;
  public:boolean;
  confirmed:boolean;

  public static arrayMap(json):ProducerPivot[]{
    let producers:ProducerPivot[] = [];
    if(!json){
      return [];
    }
    //json = JSON.parse(json);
    //An object was passed in
    for(let producer of json){
      let producerObj = this.map(producer);
      producers.push(producerObj);
    }
    return producers;
  }

  public static map(json):ProducerPivot{
    let currentProducer = new ProducerPivot();
    currentProducer.eventId = json.event_id;
    currentProducer.pageId = json.page_id;
    currentProducer.name = json.name;
    currentProducer.info = json.info;
    currentProducer.privateInfo = json.private_info;
    currentProducer.imageUrl = json.imageurl;
    if ( currentProducer.imageUrl != null) { //
      currentProducer.imageIcon = currentProducer.imageUrl.replace(/\.[^/.]+$/, "") + "_icon.jpg";
      currentProducer.imageSm = currentProducer.imageUrl.replace(/\.[^/.]+$/, "") + "_sm.jpg";
      currentProducer.imageLg = currentProducer.imageUrl.replace(/\.[^/.]+$/, "") + "_lg.jpg";
    }
    currentProducer.order = json.order;
    currentProducer.public = json.public;
    currentProducer.confirmed = json.confirmed;
    return currentProducer;
  }

}

class ShowPivot {
  showId:number;
  eventId:number;
  name:string;
  info:string;
  imageUrl:string;
  imageIcon:string;
  imageSm:string;
  imageLg:string;
  order:number;

  public static arrayMap(json):ShowPivot[]{
    let shows:ShowPivot[] = [];
    if(!json){
      return [];
    }
    //json = JSON.parse(json);
    //An object was passed in
    for(let show of json){
      let showObj = this.map(show);
      shows.push(showObj);
    }
    return shows;
  }

  public static map(json):ShowPivot{
    let currentShow = new ShowPivot();
    currentShow.showId = json.show_id;
    currentShow.eventId = json.event_id;
    currentShow.name = json.name;
    currentShow.info = json.info;
    currentShow.imageUrl = json.imageurl;
    if ( currentShow.imageUrl != null) { //
      currentShow.imageIcon = currentShow.imageUrl.replace(/\.[^/.]+$/, "") + "_icon.jpg";
      currentShow.imageSm = currentShow.imageUrl.replace(/\.[^/.]+$/, "") + "_sm.jpg";
      currentShow.imageLg = currentShow.imageUrl.replace(/\.[^/.]+$/, "") + "_lg.jpg";
    }
    currentShow.order = json.order;
    return currentShow;
  }

}