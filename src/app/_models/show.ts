export class Show {
  id: number;
  name: string;
  description: string;
  category: string;
  tagline: string;
  slug: string;
  imageUrl: string;
  backgroundUrl: string;
  public: number;
  confirmed: number;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
  eventsCount: number;
  likesCount: number;
  
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
      currentShow.backgroundUrl = json.backgroundurl;
      currentShow.public = json.public;
      currentShow.confirmed = json.confirmed;
      currentShow.createdAt = json.created_at;
      currentShow.updatedAt = json.updated_at;
      currentShow.createdBy = json.created_by;
      currentShow.updatedBy = json.updated_by;
      currentShow.eventsCount = json.events_count;
      currentShow.likesCount = json.likes_count;
      return currentShow;
  }
}