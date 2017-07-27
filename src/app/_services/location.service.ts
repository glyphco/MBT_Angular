import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
import { environment } from '../../environments/environment';

@Injectable()

export class LocationService {
  constructor() {}
  
  public locationSource = new Subject<boolean>(); //will fire when location is changed

  locationChange$ = this.locationSource.asObservable();

  public getLocationName(){
    let location = this.getCurrentLocation();
    return this.coalesce(location.neighborhood, location.city, location.state, 'No name');
  }

  public setCurrentLocation(location){
    localStorage.setItem('currentLocation', JSON.stringify(location));
  }

  public getCurrentLocation(){
    return localStorage.getItem('currentLocation') ? JSON.parse(localStorage.getItem('currentLocation')): environment.locationDefault;
  }

  public hasCurrentLocation(){
    return localStorage.getItem('currentLocation') ? true : false;
  }

  public getLat(){
    let location = this.getCurrentLocation();
    return location.lat;
  }

  public getLng(){
    let location = this.getCurrentLocation();
    return location.lng;
  }

  public getDist(){
    let location = localStorage.getItem('currentLocation') ? JSON.parse(localStorage.getItem('currentLocation')): environment.locationDefault;
    let dist = location.dist;
    return dist;
  }

  public getDistMeters(){
    return this.getDist() * 1609.34;
  }

  private coalesce(...args){
    for(let key in arguments){
      if(arguments[key] && arguments[key] != 'undefined'){
        return arguments[key];
      }
    }
  }
}