import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
import { environment } from '../../environments/environment';

const geolocationOptions = {
    enableHighAccuracy: true, //will be more accurate but might take longer and uses more power
    timeout: 5000,
    maximumAge:0
  }

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

  public getOrigin(){
    return new Promise(function (resolve, reject) {
      window.navigator.geolocation.getCurrentPosition(resolve, reject, geolocationOptions);
    });
    /*
    let call = window.navigator.geolocation.getCurrentPosition(this.originSuccess.bind(this), this.originError.bind(this), geolocationOptions);
    console.log(call);*/
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

  private originSuccess(pos) {
    console.log('its a success');
    //Make a marker for the map if modal is visible
    let crd = pos.coords;
    console.log(pos.coords);
    return {lat: crd.latitude, lng: crd.longitude};
  }

  private originError(err) {
    return {lat: environment.locationDefault.lat, 
        lng: environment.locationDefault.lng };
  };
}