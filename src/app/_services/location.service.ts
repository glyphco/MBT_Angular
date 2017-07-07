import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

@Injectable()

export class LocationService {
  constructor() {}
  
  public locationSource = new Subject<boolean>(); //will fire when location is changed

  locationChange$ = this.locationSource.asObservable();

  public getLocationName(){
    let locationType = localStorage.getItem('locationType');
    if(locationType == 'custom'){
      let location = this.getSelectedLocation();
      delete location.lat;
      delete location.lng;
      return this.coalesce(location.neighborhood, location.city, location.state, 'No name');
    }else if(locationType == 'current'){
      let location = this.getCurrentLocation();
      return this.coalesce(location.neighborhood, location.city, location.state, 'No name');
    }else{
      return 'Anywhere';
    }
  }

  public setCurrentLocation(location){
    localStorage.setItem('currentLocation', JSON.stringify(location));
  }

  public setSelectedLocation(location){
    localStorage.setItem('selectedLocation', JSON.stringify(location));
  }

  public getCurrentLocation(){
    return JSON.parse(localStorage.getItem('currentLocation'));
  }

  public getSelectedLocation(){
    return JSON.parse(localStorage.getItem('selectedLocation'));
  }

  public useCurrentLocation(){
    localStorage.setItem('locationType','current');
  }

  public useSelectedLocation(){
    localStorage.setItem('locationType','selected');
  }

  public useAnyLocation(){
    localStorage.setItem('locationType','any');
  }

  public getLat(){
    let locationType = localStorage.getItem('locationType');
    let location;
    switch (locationType){
      case 'custom':
        location = this.getSelectedLocation();
        return location.lat;
      case 'current':
        location = this.getCurrentLocation();
        return location.lat;
      default:
        return false;
    }
  }

  public getLng(){
    let locationType = localStorage.getItem('locationType');
    let location;
    switch (locationType){
      case 'custom':
        location = this.getSelectedLocation();
        return location.lng;
      case 'current':
        location = this.getCurrentLocation();
        return location.lng;
      default:
        return false;
    }
  }

  private coalesce(...args){
    for(let key in arguments){
      if(arguments[key] && arguments[key] != 'undefined'){
        return arguments[key];
      }
    }
  }
}