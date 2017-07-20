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
  eventsCount:number;
  imageUrl:string;
  lat:string;
  lng:string;
  localTz:string;
  location:string;
  phone:string;
  postalCode:string;
  public:number = 1;
  slug:string;
  state:string;
  streetAddress:string;
  tagline:string;
  updatedAt:string;
  neighborhood:string;
  website:string;
  googlePlaceId:string;

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
      currentVenue.eventsCount = json.events_count;
      currentVenue.imageUrl = json.imageurl;
      currentVenue.lat = json.lat;
      currentVenue.lng = json.lng;
      currentVenue.localTz = json.local_tz;
      currentVenue.location = json.location;
      currentVenue.phone = json.phone;
      currentVenue.postalCode = json.postalcode;
      currentVenue.public = json.public;
      currentVenue.slug = json.slug;
      currentVenue.state = json.state;
      currentVenue.streetAddress = json.street_address;
      currentVenue.tagline = json.tagline;
      currentVenue.googlePlaceId = json.googlePlaceId;
      currentVenue.updatedAt = json.updated_at;
      return currentVenue;
  }
}