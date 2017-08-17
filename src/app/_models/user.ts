import { Event } from './event';

export class User {
  id:number;
  avatar:string;
  bannedUntil:string;
  city:string;
  confirmed:number;
  email:string;
  eventsImAttending = [];
  facebookId:string;
  googleId:string;
  isBanned:number;
  isOnline:number;
  lat:string;
  likedPages = [];
  likedPagesCount:number;
  likedShows = [];
  likedShowsCount:number
  likedVenues = [];
  likedVenuesCount:number;
  lng:string;
  localTz:string;
  locationname:string;
  name:string;
  postalCode:string;
  privacyevents:number;
  privacylikes:number;
  privacypyf:number;
  pyf = [];
  slug:string;
  state:string;
  streetAddress:string;
  subLocationName:any;
  username:string;

  public static arrayMap(json):User[]{
    let users:User[] = [];
    for (let user of json){
      let userObj = this.map(user);
      users.push(userObj);
    }
    return users;
  }

  public static map(json):User{
      let currentUser = new User();
      currentUser.id = json.id;
      currentUser.avatar = json.avatar;
      currentUser.bannedUntil = json.banned_until;
      currentUser.city = json.city;
      currentUser.confirmed = json.confirmed;
      currentUser.email = json.email;
      currentUser.eventsImAttending = Event.arrayMap(json.events_im_attending);
      currentUser.facebookId = json.facebook_id;
      currentUser.googleId = json.google_id;
      currentUser.isBanned = json.is_banned;
      currentUser.isOnline = json.is_online;
      currentUser.lat = json.lat;
      currentUser.likedPages = json.liked_pages;
      currentUser.likedPagesCount = json.liked_pages_count;
      currentUser.likedShows = json.liked_shows;
      currentUser.likedShowsCount = json.liked_shows_count
      currentUser.likedVenues = json.liked_venues;
      currentUser.likedVenuesCount = json.liked_venues_count;
      currentUser.lng = json.lng;
      currentUser.localTz = json.local_tz;
      currentUser.locationname = json.locationname;
      currentUser.name = json.name;
      currentUser.postalCode = json.postalcode;
      currentUser.privacyevents = json.privacyevents;
      currentUser.privacylikes = json.privacylikes;
      currentUser.privacypyf = json.privacypyf;
      currentUser.pyf = json.pyf;
      currentUser.slug = json.slug;
      currentUser.state = json.state;
      currentUser.streetAddress = json.street_address;
      currentUser.subLocationName = json.sublocationname;
      currentUser.username = json.username;
      return currentUser;
  }
}

