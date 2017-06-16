import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { Venue } from '../_models/venue';
import { VenueService } from '../_services/venue.service';

declare var google:any;

class googleAddress {
  name:string;
  street_address:string;
  city:string;
  state:string;
  postalcode:string;
  lat;
  lng;
  neighborhood:string;
  website:string;
  google_place_id:string;
  phone;
  email:string;
}

@Component({
  selector: 'app-venue-create',
  templateUrl: './venue-create.component.html',
  styleUrls: ['./venue-create.component.css']
})
export class VenueCreateComponent implements OnInit {
  venue = new Venue;
  googleAddress = new googleAddress;
  pacInput = '';
  map:any;
  marker:any;
  infowindow:any;
  infowindowContent:any;

  constructor(
    private venueService:VenueService,
    private route: ActivatedRoute,
    private location: Location
  ){}

  ngOnInit():void{
    let self = this;
    var origin = {lat: 41.94, lng: -87.68};
    var REQUIRED_ZOOM = 15;

    this.map = new google.maps.Map(document.getElementById('map'), {
      center: origin,
      zoom: 13
    });

    var card = document.getElementById('pac-card');
    var input = document.getElementById('pac-input');
    var types = document.getElementById('type-selector');
    var strictBounds = document.getElementById('strict-bounds-selector');
    this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);

    var autocomplete = new google.maps.places.Autocomplete(input);
    var placeSearch;
    var componentForm = {
      street_number: 'short_name',
      route: 'long_name',
      locality: 'long_name',
      administrative_area_level_1: 'short_name',
      neighborhood: 'long_name',
      postal_code: 'short_name'
    };

    // Bind the map's bounds (viewport) property to the autocomplete object,
    // so that the autocomplete requests use the current map bounds for the
    // bounds option in the request.
    autocomplete.bindTo('bounds', this.map);

    this.infowindow = new google.maps.InfoWindow();
    this.infowindowContent = document.getElementById('infowindow-content');
    this.infowindow.setContent(this.infowindowContent);
    this.marker = new google.maps.Marker({
      map: self.map,
      anchorPoint: new google.maps.Point(1, 1)
    });

    autocomplete.addListener('place_changed', function()
    {
      self.infowindow.close();
      self.marker.setVisible(false);
      var place = autocomplete.getPlace();
      self.fillInAddressFromPlace(place);
      if (!place.geometry) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        window.alert("No details available for input: '" + place.name + "'");
        return;
      }

      // If the place has a geometry, then present it on a map.
      if (place.geometry.viewport) {
        self.map.fitBounds(place.geometry.viewport);
      } else {
        self.map.setCenter(place.geometry.location);
        self.map.setZoom(17);  // Why 17? Because it looks good.
      }
      self.marker.setPosition(place.geometry.location);
      //marker.setVisible(true);

      var address = '';
      if (place.address_components) {
        address = [
          (place.address_components[0] && place.address_components[0].short_name || ''),
          (place.address_components[1] && place.address_components[1].short_name || ''),
          (place.address_components[2] && place.address_components[2].short_name || '')
        ].join(' ');
      }

      self.infowindowContent.children['place-icon'].src = place.icon;
      self.infowindowContent.children['place-name'].textContent = place.name;
      self.infowindowContent.children['place-address'].textContent = address;
      self.infowindow.setPosition(place.geometry.location)
      self.infowindow.open(self.map);
      self.marker.setVisible(false);
    });

    this.map.addListener("click", function (event)
    {
        var latitude = event.latLng.lat();
        var longitude = event.latLng.lng();
        var geocoder = new google.maps.Geocoder;

        if (event.placeId) {
          console.log('place:'+event.placeId);
          self.getPlaceFromID(event.placeId, self);
        } else {
          console.log('geo:'+event.latLng);
          self.geocodeLatLng(geocoder, self.map, event.latLng, self);
        }

    });
  }
  
  public getPlaceFromID(place_id, self) {
    var service = new google.maps.places.PlacesService(self.map);
    service.getDetails({
      placeId: place_id
    }, function(place, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        self.fillInAddressFromPlace(place);

        if (!place.geometry) {
          // User entered the name of a Place that was not suggested and
          // pressed the Enter key, or the Place Details request failed.
          window.alert("No details available for input: '" + place.name + "'");
          return;
        }

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
          self.map.fitBounds(place.geometry.viewport);
        } else {
          self.map.setCenter(place.geometry.location);
          self.map.setZoom(16);  // Why 17? Because it looks good.
        }

        self.marker.setPosition(place.geometry.location);
        //marker.setVisible(true);

        var address = '';
        if (place.address_components) {
          address = [
            (place.address_components[0] && place.address_components[0].short_name || ''),
            (place.address_components[1] && place.address_components[1].short_name || ''),
            (place.address_components[2] && place.address_components[2].short_name || '')
          ].join(' ');
        }

        self.infowindowContent.children['place-icon'].src = place.icon;
        self.infowindowContent.children['place-name'].textContent = place.name;
        self.infowindowContent.children['place-address'].textContent = address;
        self.infowindow.setPosition(place.geometry.location)
        self.infowindow.open(self.map);
        self.marker.setVisible(false);
      } else {
        //console.log(status);
      }

    });
  }

  public geocodeLatLng(geocoder, map, latlng, self) {
    geocoder.geocode({'location': latlng}, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          let placename = results[0].formatted_address;
          self.fillInAddressFromGeo(results[0]);
          (<HTMLInputElement>document.getElementById('pac-input')).value = placename;
        } else {
            window.alert('No results found');
        }
        map.setCenter(results[0].geometry.location);
        if (map.getZoom() < 16) {
          map.setZoom(16);  // Why 16? Because it looks good.
        }

        var address = '';
        if (results[0].address_components) {
          address = [
            (results[0].address_components[0] && results[0].address_components[0].short_name || ''),
            (results[0].address_components[1] && results[0].address_components[1].short_name || ''),
            (results[0].address_components[2] && results[0].address_components[2].short_name || '')
          ].join(' ');
        }

        self.infowindowContent.children['place-icon'].src = '';
        self.infowindowContent.children['place-name'].textContent = 'unknown';
        self.infowindowContent.children['place-address'].textContent = address;
        self.infowindow.setPosition(results[0].geometry.location)
        self.infowindow.open(map);
        self.marker.setVisible(false);
      } else {
      window.alert('Geocoder failed due to: ' + status);
      }
    });
  }

  public fillInAddressFromPlace(result) {
    var lockElements = [
      'name',
      'street_address',
      'city',
      'state',
      'postalcode',
      'lat',
      'lng',
      'google_place_id',
    ];
    var unlockElements = [
      'neighborhood',
      'website',
      'phone',
      'email',
      'submit',
      'image',
      'background'
    ];
    for (var element in lockElements) {
      //document.getElementById(element).value = '';
      this.googleAddress[element] = '';
    }

    for (var element in unlockElements) {
      //document.getElementById(element).value = '';
      this.googleAddress[element] = '';
    }
    //document.getElementById('submit').value = 'Submit';
    //console.log(result.address_components);

    var longcomponents=<any>[];
    var shortcomponents=<any>[];
    for (var i = 0; i < result.address_components.length; i++) {
        longcomponents[result.address_components[i]['types'][0]] = result.address_components[i]['long_name'];
        shortcomponents[result.address_components[i]['types'][0]] = result.address_components[i]['short_name'];
    }

    this.googleAddress.name = this.coalesce(result.name,'');
    this.googleAddress.street_address = this.coalesce(longcomponents.street_number + ' ' + shortcomponents.route),'';
    this.googleAddress.city = this.coalesce(longcomponents.locality,'');
    this.googleAddress.state = this.coalesce(shortcomponents.administrative_area_level_1,'');
    this.googleAddress.postalcode = this.coalesce(shortcomponents.postal_code,'');
    this.googleAddress.lat = this.coalesce(result.geometry.location.lat(),'');
    this.googleAddress.lng = this.coalesce(result.geometry.location.lng(),'');

    this.googleAddress.neighborhood = this.coalesce(longcomponents.neighborhood,'');
    this.googleAddress.website = this.coalesce(result.website,'');
    this.googleAddress.google_place_id = this.coalesce(result.id,'');
    this.googleAddress.phone = this.coalesce(result.phone,'');
    this.googleAddress.email = this.coalesce(result.email,'');
    /*
    for (var element in lockElements) {
      (<HTMLInputElement>document.getElementById(element)).readOnly = true;
      document.getElementById(element).style.backgroundColor = "#999";
    }

    for (var element in unlockElements) {
      (<HTMLInputElement>document.getElementById(element)).readOnly = false;
    }*/
  }
  
  public fillInAddressFromGeo(result) {
      // Get the place details from the autocomplete object.
      //var place = autocomplete.getPlace();
    var lockElements = [
      'street_address',
      'city',
      'state',
      'postalcode',
      'lat',
      'lng',
      'google_place_id',
    ];
    var unlockElements = [
      'name',
      'neighborhood',
      'website',
      'phone',
      'email',
      'submit',
      'image',
      'background'
    ];
    /*
    for (var element in lockElements) {
      (<HTMLInputElement>document.getElementById(element)).value = '';
      (<HTMLInputElement>document.getElementById(element)).readOnly = true;
      document.getElementById(element).style.backgroundColor = "#999";
    }

    for (var element in unlockElements) {
      (<HTMLInputElement>document.getElementById(element)).value = '';
      (<HTMLInputElement>document.getElementById(element)).readOnly = false;
    }
    */

    //document.getElementById('submit').value = 'Submit';
    //console.log(result.address_components);

    var longcomponents=<any>[];
    var shortcomponents=<any>[];
    for (var i = 0; i < result.address_components.length; i++) {
      longcomponents[result.address_components[i]['types'][0]] = result.address_components[i]['long_name'];
      shortcomponents[result.address_components[i]['types'][0]] = result.address_components[i]['short_name'];
    }

    this.googleAddress.street_address = '';
    this.googleAddress.street_address = (longcomponents.street_number + ' ' + shortcomponents.route) || '';
    this.googleAddress.city = this.coalesce(longcomponents.locality,'');
    this.googleAddress.state = this.coalesce(shortcomponents.administrative_area_level_1,'');
    this.googleAddress.postalcode = this.coalesce(shortcomponents.postal_code,'');
    this.googleAddress.lat = this.coalesce(result.geometry.location.lat(),'');
    this.googleAddress.lng = this.coalesce(result.geometry.location.lng(),'');

    this.googleAddress.neighborhood = this.coalesce(longcomponents.neighborhood,'');
    this.googleAddress.website = '';
    this.googleAddress.google_place_id = '';
    this.googleAddress.phone = '';
    this.googleAddress.email = '';
  }

  public coalesce(...args) {
    var len = arguments.length;
    for (var i=0; i<len; i++) {
        if (arguments[i] !== null && arguments[i] !== undefined) {
            return arguments[i];
        }
    }
    return null;
  }

  public goBack(): void {
    this.location.back();
  }

  public onSubmit(){
    this.createVenue();
  }

  private createVenue(){
    this.venueService.createVenue(this.venue).then(response => {
      
    }).catch(error => console.log(error));
  }
}
