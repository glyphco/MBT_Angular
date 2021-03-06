import { Event } from './event';

export class Page {
  id = -1;
  name: string;
  slug: string;
  streetAddress: string;
  city: string;
  state: string;
  postalcode: string;
  lat: string;
  lng: string;
  participant: boolean = true;
  production: boolean = false;
  canhavemembers: boolean;
  canbeamember: boolean;
  public: boolean = true;
  confirmed: boolean;
  tagline: string;
  description: string;
  imageUrl: string;
  imageIcon: string;
  imageSm: string;
  imageLg: string;
  backgroundUrl: string;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
  location: string;
  startTime:string; //used for event create
  categoriesJson:any;
  iLike:number;

  eventsCount: number;
  likesCount: number;
  pyfslikeCount: number;
  pyfslike: any;  
  eventsAsParticipantCurrent = [];
  eventsAsProducerCurrent = [];

  public static arrayMap(json):Page[]{
    let pages:Page[] = [];
    for (let page of json){
      let pageObj = this.map(page);
      pages.push(pageObj);
    }
    return pages;
  }

  public static map(json):Page{
      let currentPage = new Page();
      currentPage.id = json.id; 
      currentPage.name = json.name; 
      currentPage.slug = json.slug; 
      currentPage.streetAddress = json.street_address; 
      currentPage.city = json.city; 
      currentPage.state = json.state; 
      currentPage.postalcode = json.postalcode; 
      currentPage.lat = json.lat; 
      currentPage.lng = json.lng; 
      currentPage.participant = json.participant; 
      currentPage.production = json.production; 
      currentPage.canhavemembers = json.canhavemembers; 
      currentPage.canbeamember = json.canbeamember; 
      currentPage.public = json.public; 
      currentPage.confirmed = json.confirmed; 
      currentPage.tagline = json.tagline; 
      currentPage.description = json.description; 
      currentPage.imageUrl = json.imageurl; 
      if ( currentPage.imageUrl ) { //
        currentPage.imageIcon = currentPage.imageUrl.replace(/\.[^/.]+$/, "") + "_icon.jpg";
        currentPage.imageSm = currentPage.imageUrl.replace(/\.[^/.]+$/, "") + "_sm.jpg";
        currentPage.imageLg = currentPage.imageUrl.replace(/\.[^/.]+$/, "") + "_lg.jpg";
      }
      currentPage.backgroundUrl = json.backgroundurl; 
      currentPage.createdAt = json.created_at; 
      currentPage.updatedAt = json.updated_at; 
      currentPage.createdBy = json.created_by; 
      currentPage.updatedBy = json.updated_by; 
      currentPage.location = json.location; 
      currentPage.eventsCount = json.events_count; 
      currentPage.likesCount = json.likes_count; 
      currentPage.pyfslikeCount = json.pyfslike_count; 
      currentPage.pyfslike = json.pyfslike; 
      currentPage.iLike = json.ilike_count; 
      currentPage.eventsAsParticipantCurrent = Event.arrayMap(json.events_as_participant_current);    
      currentPage.eventsAsProducerCurrent = Event.arrayMap(json.events_as_producer_current);    
      currentPage.categoriesJson = json.categoriesjson; 
      return currentPage;
  }
}

