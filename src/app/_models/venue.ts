import { Event } from './event';

export class Venue {
  id = -1;
  name: string;
  city: string;
  backgroundUrl: string;
  createdAt: string;
  currentEventsCount:number;
  description:string;
  imageUrl:string;
  imageSm:string;
  imageLg:string;
  lat:string;
  lng:string;
  localTz:string;
  location:string;
  postalCode:string;
  public:boolean = true;
  confirmed:boolean = false;
  slug:string;
  state:string;
  streetAddress:string;
  updatedAt:string;
  neighborhood:string;
  website:string;
  googlePlaceId:string;

  eventsCount = 0;
  eventsListCurrent = [];
  likesCount = 0;
  pyfslikeCount = 0;
  pyfslike= [];  

  public static arrayMap(json):Venue[]{
    let venues:Venue[] = [];
    for (let venue of json){
      let venueList = this.map(venue);
      venues.push(venueList);
    }
    return venues;
  }

  public static map(json):Venue{
      let currentVenue = new Venue();
      currentVenue.id = json.id;
      currentVenue.name = json.name;
      currentVenue.backgroundUrl = json.backgroundurl;
      currentVenue.city = json.city;
      currentVenue.createdAt = json.created_at;
      currentVenue.currentEventsCount = json.currentevents_count;
      currentVenue.description = json.description;
      currentVenue.imageUrl = json.imageurl;
      if ( currentVenue.imageUrl != null) { //
        currentVenue.imageSm = currentVenue.imageUrl.replace(/\.[^/.]+$/, "") + "_sm.jpg";
        currentVenue.imageLg = currentVenue.imageUrl.replace(/\.[^/.]+$/, "") + "_lg.jpg";
      }
      currentVenue.lat = json.lat;
      currentVenue.lng = json.lng;
      currentVenue.localTz = json.local_tz;
      currentVenue.location = json.location;
      currentVenue.neighborhood = json.neighborhood;
      currentVenue.postalCode = json.postalcode;
      currentVenue.public = json.public;
      currentVenue.confirmed = json.confirmed;
      currentVenue.slug = json.slug;
      currentVenue.website = json.website;
      currentVenue.state = json.state;
      currentVenue.streetAddress = json.street_address;
      currentVenue.googlePlaceId = json.googlePlaceId;
      currentVenue.updatedAt = json.updated_at;

      currentVenue.eventsCount = json.events_count; 
      currentVenue.likesCount = json.likes_count; 
      currentVenue.pyfslikeCount = json.pyfslike_count; 
      currentVenue.pyfslike = json.pyfslike; 
      //currentVenue.eventslistcurrent = json.eventslistcurrent; 
      currentVenue.eventsListCurrent = Event.arrayMap(json.eventslistcurrent);     

      return currentVenue;
  }
}