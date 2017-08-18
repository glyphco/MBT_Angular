import { Injectable } from '@angular/core';
import { User } from '../_models/user';
import { HttpHandlerService } from './http-handler.service';

const availablePermissions = [
  "view-users",
  "edit-users",
  "ban-users",
  "admin-pages",
  "confirm-pages",
  "create-pages",
  "edit-pages",
  "delete-pages",
  "admin-venues",
  "confirm-venues",
  "create-venues",
  "edit-venues",
  "delete-venues",
  "admin-events",
  "confirm-events",
  "create-events",
  "edit-events",
  "delete-events",
  "administer-event",
  "edit-event",
  "administer-page", 
  "edit-page", 
  "administer-venue",
  "edit-venue"];

@Injectable()

export class MeService {
  private _id;
  private _permissions = {};
  private _profilePicture = 'assets/images/default_user.png';
  private _name = ' ';

  get profilePicture() {
    return this._profilePicture;
  }
  get name(){
    return this._name;
  }

  get id(){
    return this._id;
  }

  get firstName(){
    return this._name.split(' ')[0];
  }

  constructor(
      private httpHandlerService: HttpHandlerService
    ){}

  private init(user){
    this._name = user.name;
    this._profilePicture = user.avatar;
    this._id = user.id;
    this._permissions = user.access;
  }

  private isInitialized(){
    return this._id ? true : false; 
  }

  public initializeMe(){
    return new Promise((resolve, reject) => {
      if(this.isInitialized()){
        resolve(true);
      }
      this.getUserInfo().then(user => {
        this.init(user);
        resolve(true);
      }).catch(error => reject(false));
    });
  }

  public hasBackstage(){
    return this.hasAny(availablePermissions);
  }

  public hasEvents(){
    return this.hasEventCreate() || this.hasEventConfirm() || this.hasEventEdit();
  }

  public hasEventCreate(){
    return this.hasAny(["create-events"]);
  }

  public hasEventConfirm(){
    return this.hasAny(["confirm-events"]);
  }

  public hasEventEdit(){
    return this.hasAny([
      "edit-events",
      "admin-events",
      "edit-event",
      "administer-event"
    ]);
  }

  public hasVenues(){
    return this.hasVenueCreate() || this.hasVenueConfirm() || this.hasVenueEdit();
  }

  public hasVenueCreate(){
    return this.hasAny(["create-venues"]);
  }
  public hasVenueConfirm(){
    return this.hasAny(["confirm-venues"]);
  }
  public hasVenueEdit(){
    return this.hasAny([
      "edit-venues",
      "admin-venues",
      "edit-venue",
      "administer-venue"
    ]);
  }

  public hasPages(){
    return this.hasPageCreate() || this.hasPageConfirm() || this.hasPageEdit();
  }

  public hasPageCreate(){
    return this.hasAny(["create-pages"]);
  }
  public hasPageConfirm(){
    return this.hasAny(["confirm-pages"]);
  }
  public hasPageEdit(){
    return this.hasAny([
      "edit-pages",
      "admin-pages",
      "edit-page",
      "administer-page"
    ]);
  }

  public hasUsers(){
    return this.hasViewUsers() || this.hasUserEdit() || this.hasUserBan();
  }

  public hasViewUsers(){
    return this.hasAny(["view-users"]);
  }

  public hasUserEdit(){
    return this.hasAny(["edit-users"]);
  }

  public hasUserConfirm(){
    return this.hasUserEdit();
  }

  public hasUserBan(){
    return this.hasAny(["ban-users"]);
  }

  private hasAny(permissionCheck){
    for(let check in permissionCheck){
      if(this._permissions[permissionCheck[check]]){
        return true;
      }
    }
    return false;
  }

  private hasAll(){

  }

  private getUserInfo(){
    return this.httpHandlerService.get('me')
      .map(response => response.json().data)
      .toPromise()
  }

  getMeEdit(id:number):Promise<any>{
    return this.httpHandlerService.get(`me/edit`)
      .map(response => response.json())
      .toPromise();
  }

  updateMe(user:User):Promise<any>{
    let id = user.id;
    let options = {
      backgroundurl:user.backgroundUrl,
      city:user.city,
      confirmed:user.confirmed,
      email:user.email,
      imageurl:user.imageUrl,
      name:user.name,
      postalcode:user.postalCode,
      privacyevents:user.privacyEvents,
      privacylikes:user.privacyLikes,
      privacypyf:user.privacyPyf,
      state:user.state,
      neighborhood:user.neighborhood,
      username:user.username,
      bio:user.bio
    };
    return this.httpHandlerService.put(`user/${id}`, options)
      .toPromise();
  }

  public getFollowRequests(){
    return this.httpHandlerService.get('me/followers/requests')
      .map(response => response.json())
      .toPromise();
  }

  public getFollowers(){
    return this.httpHandlerService.get('me/followers')
      .map(response => response.json())
      .toPromise();
  }

  public getPyfs(){
    return this.httpHandlerService.get('me/pyfs')
      .map(response => response.json())
      .toPromise();
  }

  public getFollowersBlocked(){
    return this.httpHandlerService.get('me/followers/blocked')
      .map(response => response.json())
      .toPromise();
  }

} 
 
