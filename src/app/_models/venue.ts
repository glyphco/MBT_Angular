import { Event } from './event';

export class Venue {
  id = -1;
  name: string;
  city: string;
  backgroundUrl: string;
  category: string;
  createdAt: string;
  currentEventsCount:number;
  description:string;
  email:string;
  imageUrl:string;
  lat:string;
  lng:string;
  localTz:string;
  location:string;
  phone:string;
  postalCode:string;
  public:boolean = true;
  confirmed:boolean = false;
  slug:string;
  state:string;
  streetAddress:string;
  tagline:string;
  updatedAt:string;
  neighborhood:string;
  website:string;
  googlePlaceId:string;

  eventsCount = 0;
  eventsListCurrent = [];
  likesCount = 0;
  friendslikeCount = 0;
  friendslike= [];  

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
      currentVenue.category = json.category;
      currentVenue.city = json.city;
      currentVenue.createdAt = json.created_at;
      currentVenue.currentEventsCount = json.currentevents_count;
      currentVenue.description = json.description;
      currentVenue.email = json.email;
      currentVenue.imageUrl = json.imageurl;
      currentVenue.lat = json.lat;
      currentVenue.lng = json.lng;
      currentVenue.localTz = json.local_tz;
      currentVenue.location = json.location;
      currentVenue.neighborhood = json.neighborhood;
      currentVenue.phone = json.phone;
      currentVenue.postalCode = json.postalcode;
      currentVenue.public = json.public;
      currentVenue.confirmed = json.confirmed;
      currentVenue.slug = json.slug;
      currentVenue.website = json.website;
      currentVenue.state = json.state;
      currentVenue.streetAddress = json.street_address;
      currentVenue.tagline = json.tagline;
      currentVenue.googlePlaceId = json.googlePlaceId;
      currentVenue.updatedAt = json.updated_at;

      currentVenue.eventsCount = json.events_count; 
      currentVenue.likesCount = json.likes_count; 
      currentVenue.friendslikeCount = json.friendslike_count; 
      currentVenue.friendslike = json.friendslike; 
      //currentVenue.eventslistcurrent = json.eventslistcurrent; 
      currentVenue.eventsListCurrent = Event.arrayMap(json.eventslistcurrent);     

      return currentVenue;
  }
}