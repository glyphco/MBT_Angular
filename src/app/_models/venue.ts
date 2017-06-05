export class Venue {
  id: number;
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
  location:string;
  phone:string;
  postalcode:string;
  public:number;
  slug:string;
  state:string;
  streetAddress:string;
  tagline:string;
  updatedAt:string;

  public static map(json):Venue[]{
    let venues:Venue[] = [];
    for (let venue of json){
      let currentVenue = new Venue();
      currentVenue.id = venue.id;
      currentVenue.name = venue.name;
      currentVenue.backgroundUrl = venue.backgroundurl;
      currentVenue.category = venue.category;
      currentVenue.city = venue.city;
      currentVenue.createdAt = venue.created_at;
      currentVenue.currentEventsCount = venue.currentevents_count;
      currentVenue.description = venue.description;
      currentVenue.email = venue.email;
      currentVenue.eventsCount = venue.events_count;
      currentVenue.imageUrl = venue.imageurl;
      currentVenue.lat = venue.lat;
      currentVenue.lng = venue.lng;
      currentVenue.location = venue.location;
      currentVenue.phone = venue.phone;
      currentVenue.postalcode = venue.postalcode;
      currentVenue.public = venue.public;
      currentVenue.slug = venue.slug;
      currentVenue.state = venue.state;
      currentVenue.streetAddress = venue.streetAddress;
      currentVenue.tagline = venue.tagline;
      currentVenue.updatedAt = venue.updated_at;
      venues.push(currentVenue);
    }
    return venues;
  }
}