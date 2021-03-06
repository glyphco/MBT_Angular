import { Event } from './event';

export class User {
  id:number;
  avatar:string;
  bio:string;
  bannedUntil:any;
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
  locationName:string;
  name:string;
  postalCode:string;
  privacyEvents:number;
  privacyLikes:number;
  privacyPyf:number;
  pyf = [];
  pyfCount = 0;
  role:string;
  followers = [];
  followersCount = 0;
  youSeeUser = 1;
  userSeesYou = 1;
  slug:string;
  state:string;
  streetAddress:string;
  subLocationName:any;
  username:string;
  imageUrl:string;
  imageIcon:string;
  imageSm:string;
  imageLg:string;
  backgroundUrl:string;
  neighborhood:string;
  autoAcceptFollows:number;
  createdAt:string;

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
      currentUser.bio = json.bio;
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
      currentUser.likedPages = json.liked_pages ? json.liked_pages : [];
      currentUser.likedPagesCount = json.liked_pages_count;
      currentUser.likedShows = json.liked_shows ? json.liked_shows : [];
      currentUser.likedShowsCount = json.liked_shows_count
      currentUser.likedVenues = json.liked_venues ? json.liked_venues : [];
      currentUser.likedVenuesCount = json.liked_venues_count;
      currentUser.lng = json.lng;
      currentUser.localTz = json.local_tz;
      currentUser.locationName = json.locationname;
      currentUser.name = json.name;
      currentUser.postalCode = json.postalcode;
      currentUser.privacyEvents = json.privacyevents;
      currentUser.privacyLikes = json.privacylikes;
      currentUser.privacyPyf = json.privacypyf;
      currentUser.pyf = json.pyf;
      currentUser.pyfCount = json.pyf_count;
      currentUser.role = json.role;
      currentUser.followers = json.followers;
      currentUser.followersCount = json.followers_count;
      currentUser.userSeesYou = json.userseesyou;
      currentUser.youSeeUser = json.youseeuser;
      currentUser.slug = json.slug;
      currentUser.state = json.state;
      currentUser.streetAddress = json.street_address;
      currentUser.subLocationName = json.sublocationname;
      currentUser.autoAcceptFollows = json.autoacceptfollows;
      currentUser.username = json.username;
      currentUser.imageUrl = json.imageurl;
      if ( currentUser.imageUrl ) { //
        currentUser.imageIcon = currentUser.imageUrl.replace(/\.[^/.]+$/, "") + "_icon.jpg";
        currentUser.imageSm = currentUser.imageUrl.replace(/\.[^/.]+$/, "") + "_sm.jpg";
        currentUser.imageLg = currentUser.imageUrl.replace(/\.[^/.]+$/, "") + "_lg.jpg";
      } else {
        currentUser.imageIcon = currentUser.avatar;
        currentUser.imageSm = currentUser.avatar;
        currentUser.imageLg = currentUser.avatar;
      }
      currentUser.backgroundUrl = json.backgroundurl;
      currentUser.neighborhood = json.neighborhood;
      currentUser.createdAt = json.created_at;
      return currentUser;
  }
}

