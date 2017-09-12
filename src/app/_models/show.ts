import { Event } from './event';

export class Show {
  id: number;
  name: string;
  description: string;
  category: string;
  tagline: string;
  slug: string;
  imageUrl: string;
  imageIcon: string;
  imageSm: string;
  imageLg: string;
  backgroundUrl: string;
  public: boolean = true;
  categoriesJson:any;
  confirmed: number;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number;

  iLike:number;
  eventsCount: number;
  eventsListCurrent: any;
  likesCount: number;
  pyfslikeCount: number;
  pyfslike: any;  
  
  public static arrayMap(json):Show[]{
    let shows:Show[] = [];
    for (let show of json){
      let showObj = this.map(show);
      shows.push(showObj);
    }
    return shows;
  }
  
  public static map(json):Show{
      let currentShow = new Show();
      currentShow.id = json.id;
      currentShow.name = json.name;
      currentShow.description = json.description;
      currentShow.category = json.cateory;
      currentShow.tagline = json.tagline;
      currentShow.slug = json.slug;
      currentShow.imageUrl = json.imageurl;
      if ( currentShow.imageUrl ) { //
        currentShow.imageIcon = currentShow.imageUrl.replace(/\.[^/.]+$/, "") + "_icon.jpg";
        currentShow.imageSm = currentShow.imageUrl.replace(/\.[^/.]+$/, "") + "_sm.jpg";
        currentShow.imageLg = currentShow.imageUrl.replace(/\.[^/.]+$/, "") + "_lg.jpg";
      }
      currentShow.backgroundUrl = json.backgroundurl;
      currentShow.public = json.public;
      currentShow.confirmed = json.confirmed;
      currentShow.createdAt = json.created_at;
      currentShow.updatedAt = json.updated_at;
      currentShow.createdBy = json.created_by;
      currentShow.updatedBy = json.updated_by;
      currentShow.iLike = json.ilike_count;
      currentShow.eventsCount = json.events_count; 
      currentShow.likesCount = json.likes_count; 
      currentShow.pyfslikeCount = json.pyfslike_count; 
      currentShow.pyfslike = json.pyfslike; 
      currentShow.eventsListCurrent = Event.arrayMap(json.eventslistcurrent);   
      currentShow.categoriesJson = json.categoriesjson;
      return currentShow;
  }
}
