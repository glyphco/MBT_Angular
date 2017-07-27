import { Component, OnInit, NgZone } from '@angular/core';
import { Router }   from '@angular/router';
import { AuthService } from './_services/auth.service';
import { LocationService } from './_services/location.service';

declare var google:any;
const geolocationOptions = {
      enableHighAccuracy: true, //will be more accurate but might take longer and uses more power
      timeout: 5000,
      maximumAge:0
    }

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css','./_components/modal.component.css']
})
export class AppComponent implements OnInit {
  title = 'MBT';
  loggedIn= this.authService.loggedIn;
  map:any;
  lat:number;
  lng:number;
  dist = 0.5;
  geocoder:any;
  marker:any;
  circle:any;
  userLocation = 'Choose location';
  locationModalVisible = false;
  get username() {
    let fullname = localStorage.getItem('username').split(' ');
    return fullname[0];
  }

  constructor( private authService: AuthService, private _ngZone:NgZone, private router:Router, private locationService:LocationService){}

  ngOnInit(){
    //set location name
    this.userLocation = this.locationService.getLocationName();

    //Google map stuff
    this.geocoder = new google.maps.Geocoder;

    //Google map stuff
    var origin = {lat: 41.94, lng: -87.68};
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: origin,
      zoom: 13
    });

    this.circle = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: this.map
    });

    this.circle.addListener("click", function (event) {
      this.clickReceived(event);
    }.bind(this));

    this.map.addListener("click", function (event) {
      this.clickReceived(event);
    }.bind(this));
  }

  saveLocation(){
    if(this.lat && this.lng && this.lat != this.locationService.getLat() && this.lng != this.locationService.getLng()){
      //new location is different from old location
      this.geocodeLatLng(this.lat, this.lng);
    }else{
      this.locationModalVisible = false;
    }
  }

  success(pos) {
    if(this.locationModalVisible){
      //Make a marker for the map if modal is visible
      let crd = pos.coords;
      this.lat = crd.latitude;
      this.lng = crd.longitude;
      this.placeMarkerAndCircle();
      this.map.setCenter({lat: this.lat, lng: this.lng});
    }
  }

  error(err) {
    //console.warn(`ERROR(${err.code}): ${err.message}`);
    //user denied geolocation
    if(err.code == 1){
      //this.selectLocation = true;
    }
  };

  private clickReceived(event){
    var latitude = event.latLng.lat();
      var longitude = event.latLng.lng();
      this.lat = latitude;
      this.lng = longitude;
      this.placeMarkerAndCircle();
  }

  distanceChanged(){
    this.setMapZoom();
    this.placeMarkerAndCircle();
    this.map.setCenter({lat: this.lat, lng: this.lng});
  }

  setMapZoom(){
    switch(this.dist * 1) {
        case 0.5:
            this.map.setZoom(13);
            break;
        case 1:
            this.map.setZoom(13);
            break;
        case 2:
            this.map.setZoom(12);
            break;
        case 5:
            this.map.setZoom(11);
            break;
        case 10:
            this.map.setZoom(10);
            break;
        case 20:
            this.map.setZoom(9);
            break;
        default:
            this.map.setZoom(13);
    }
  }

  placeMarkerAndCircle(){
    if(this.marker){
      this.marker.setPosition({lat: this.lat, lng: this.lng});
      this.circle.setCenter({lat: this.lat, lng: this.lng});
      this.circle.setRadius(this.dist * 1609.34);
    }else{
      this.marker = new google.maps.Marker({
        map: this.map,
        //anchorPoint: new google.maps.Point(latitude, longitude),
        position: {lat: this.lat, lng: this.lng}
      });
      this.circle.setCenter({lat: this.lat, lng: this.lng});
      this.circle.setRadius(this.dist * 1609.34);
    }
  }

  geocodeLatLng(lat, lng):void {
    var latlng = {lat: parseFloat(lat), lng: parseFloat(lng)};
    this.geocoder.geocode({'location': latlng}, function(results, status) {
      if (status === 'OK') {
        if (results[1]) {
          let locationDetails = <any>{};
          for (let component of results[1].address_components){
            locationDetails[component.types[0]] = component.long_name;
          }
          let locationProps = {
            lat: lat,
            lng: lng,
            city: locationDetails.locality,
            neighborhood: locationDetails.neighborhood,
            state: locationDetails.administrative_area_level_1,
            postal_code: locationDetails.postal_code,
            country: locationDetails.country
          };
          this.locationService.setCurrentLocation(locationProps);
          //set user location text
          this.userLocation = this.locationService.getLocationName();
          this._ngZone.run(() => {
            //emit location change event
            this.locationService.locationSource.next(true);
            this.locationModalVisible = false;
          });
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    }.bind(this));
  }

  selectLocation(){
    if(!this.locationModalVisible){ //show the modal if it's not already visible
      if(!this.locationService.hasCurrentLocation()){ //Ask for location if we don't have it in local storage
        window.navigator.geolocation.getCurrentPosition(this.success.bind(this), this.error.bind(this), geolocationOptions);
      }else{
        //put local location on the map
        this.lat = this.locationService.getLat();
        this.lng = this.locationService.getLng();
        this.map.setCenter({lat: this.lat, lng: this.lng});
        this.placeMarkerAndCircle();
      }
    }
    //toggle location modal
    this.locationModalVisible = !this.locationModalVisible;
    //this.locationService.useSelectedLocation();
    //this.locationService.locationSource.next(true);
  }

  logout(){
    this.authService.logout();
  }

  redirectToSearch(){
    this.router.navigate(['search']);
  }
}
