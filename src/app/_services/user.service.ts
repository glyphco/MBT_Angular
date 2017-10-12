import { Injectable } from '@angular/core';
import { HttpHandlerService } from './http-handler.service';
import { User } from '../_models/user';
import 'rxjs/add/operator/toPromise';


@Injectable()

export class UserService {
  constructor(
    private httpHandlerService: HttpHandlerService
  ){}

  getUsersEditable(page=1, perpage=10, options):Promise<any>{
    let query = this.httpHandlerService.serialize(options);
    return this.httpHandlerService.get(`user/editable?page=${page}&pp=${perpage}&${query}`)
      .map(response => response.json().data)
      .toPromise();
  }

  getUser(id:number):Promise<any>{
    return this.httpHandlerService.get(`user/${id}/details`)
      .map(response => response.json().data)
      .toPromise();
  }

  getUserEdit(id:number):Promise<any>{
    return this.httpHandlerService.get(`user/${id}/edit`)
      .toPromise();
  }

  updateUser(user:User):Promise<any>{
    let id = user.id;
    let options = {
      avatar:user.avatar,
      backgroundurl:user.backgroundUrl,
      banned_until:user.bannedUntil,
      city:user.city,
      confirmed:user.confirmed,
      imageurl:user.imageUrl,
      is_banned:user.isBanned,
      is_online:user.isOnline,
      local_tz:user.localTz,
      locationname:user.locationName,
      name:user.name,
      postalcode:user.postalCode,
      privacyevents:user.privacyEvents,
      privacylikes:user.privacyLikes,
      privacypyf:user.privacyPyf,
      slug:user.slug,
      state:user.state,
      street_address:user.streetAddress,
      sublocationname:user.subLocationName,
      username:user.username
    };
    return this.httpHandlerService.put(`user/${id}`, options)
      .toPromise();
  }

  updateRole(userId:number,role:string):Promise<any>{
    return this.httpHandlerService.get(`user/${userId}/make${role}`)
      .toPromise();
  }

  confirmUser(id:number){
    return this.httpHandlerService.get(`user/${id}/confirm`)
    .map(response => response.json().data)
    .toPromise();
  }
}