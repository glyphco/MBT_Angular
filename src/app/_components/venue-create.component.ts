import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { Venue } from '../_models/venue';
import { VenueService } from '../_services/venue.service';
import { CategoryService } from '../_services/category.service';
import { StatesHelper } from '../_helpers/states-helper';

declare var google:any;

@Component({
  selector: 'app-venue-create',
  templateUrl: './venue-create.component.html',
  styleUrls: ['./venue-create.component.css']
})
export class VenueCreateComponent implements OnInit {
  venue = new Venue;
  pacInput = '';
  map:any;
  marker:any;
  infowindow:any;
  infowindowContent:any;
  states = StatesHelper.states;
  image:any;
  jpegImage:any;
  timezones = [
    {'id':'Pacific/Honolulu', 'name'  : 'Hawaii-Aleutian Standard Time (HAST)'},
    {'id':'America/Anchorage', 'name' : 'Alaska with Daylight Savings Time (AKDT)'},
    {'id':'PST8PDT', 'name'           : 'Pacific with Daylight Savings Time (PDT)'},
    {'id':'MST', 'name'               : 'Mountain Standard Time (Arizona) (MST)'},
    {'id':'MST7MDT', 'name'           : 'Mountain with Daylight Savings Time (MDT)'},
    {'id':'CST6CDT', 'name'           : 'Central with Daylight Savings Time (CDT)'},
    {'id':'EST5EDT', 'name'           : 'Eastern with Daylight Savings Time (EDT)'}
  ];

  constructor(
    private venueService:VenueService,
    private route: ActivatedRoute,
    private location: Location,
    private _zone: NgZone,
    private categoryService: CategoryService
  ){}

  //TODO: remove this later
  debugVenue(){
    console.log(this.venue);
  }

  ngOnInit():void{
    let self = this;

    //Google map stuff
    var origin = {lat: 41.94, lng: -87.68};
    var REQUIRED_ZOOM = 15;

    this.map = new google.maps.Map(document.getElementById('venue-map'), {
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
          self.getPlaceFromID(event.placeId, self)
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
      'streetAddress',
      'city',
      'state',
      'postalCode',
      'lat',
      'lng',
      'googlePlaceId',
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
      this.venue[element] = '';
    }

    for (var element in unlockElements) {
      //document.getElementById(element).value = '';
      this.venue[element] = '';
    }
    //document.getElementById('submit').value = 'Submit';
    //console.log(result.address_components);

    var longcomponents=<any>[];
    var shortcomponents=<any>[];
    for (var i = 0; i < result.address_components.length; i++) {
        longcomponents[result.address_components[i]['types'][0]] = result.address_components[i]['long_name'];
        shortcomponents[result.address_components[i]['types'][0]] = result.address_components[i]['short_name'];
    }

    this._zone.run(() => {
      this.venue.name = this.coalesce(result.name,'');
      this.venue.streetAddress = this.coalesce(longcomponents.street_number + ' ' + shortcomponents.route),'';
      this.venue.city = this.coalesce(longcomponents.locality,'');
      this.venue.state = this.coalesce(shortcomponents.administrative_area_level_1,'');
      this.venue.postalCode = this.coalesce(shortcomponents.postal_code,'');
      this.venue.lat = this.coalesce(result.geometry.location.lat(),'');
      this.venue.lng = this.coalesce(result.geometry.location.lng(),'');

      this.venue.neighborhood = this.coalesce(longcomponents.neighborhood,'');
      this.venue.website = this.coalesce(result.website,'');
      this.venue.googlePlaceId = this.coalesce(result.id,'');
      this.venue.phone = this.coalesce(result.phone,'');
      this.venue.email = this.coalesce(result.email,'');
    })
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
      'streetAddress',
      'city',
      'state',
      'postalCode',
      'lat',
      'lng',
      'googlePlaceId',
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

    this.venue.streetAddress = '';
    this.venue.streetAddress = (longcomponents.street_number + ' ' + shortcomponents.route) || '';
    this.venue.city = this.coalesce(longcomponents.locality,'');
    this.venue.state = this.coalesce(shortcomponents.administrative_area_level_1,'');
    this.venue.postalCode = this.coalesce(shortcomponents.postal_code,'');
    this.venue.lat = this.coalesce(result.geometry.location.lat(),'');
    this.venue.lng = this.coalesce(result.geometry.location.lng(),'');

    this.venue.neighborhood = this.coalesce(longcomponents.neighborhood,'');
    this.venue.website = '';
    this.venue.googlePlaceId = '';
    this.venue.phone = '';
    this.venue.email = '';
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

  fileChange(imageField){
    this.readFiles(imageField.files);
  }

  readFiles(files, index = 0) {  
      // Create the file reader  
      let reader = new FileReader();  
      // If there is a file  
      if (index in files) {  
        // Start reading this file  
        this.readFile(files[index], reader, (result) => {  
            // Create an img element and add the image file data to it  
            var img = document.createElement("img");  
            img.src = result;  
            // Send this img to the resize function (and wait for callback)  
            this.resize(img, 200, 200, (resized_jpeg, before, after) => {  
                // For debugging (size in bytes before and after)  
                //this.debug_size_before.push(before);  
                //this.debug_size_after.push(after);  
                // Add the resized jpeg img source to a list for preview  
                // This is also the file you want to upload. (either as a  
                // base64 string or img.src = resized_jpeg if you prefer a file).  
                this.jpegImage = resized_jpeg;
                // Read the next file;  
                this.readFiles(files, index + 1);  
            });  
        });  
      } else {  
        // When all files are done This forces a change detection  
        //this.changeDetectorRef.detectChanges();  
      }  
  }

  private readFile(file, reader, callback) {  
    reader.onload = () => {  
        callback(reader.result);  
        this.image = reader.result;   
    }  
    reader.readAsDataURL(file);  
  }

  private resize(img, MAX_WIDTH: number, MAX_HEIGHT: number, callback) {  
    // This will wait until the img is loaded before calling this function  
    return img.onload = () => {  
        // Get the images current width and height  
        var width = img.width;  
        var height = img.height;  
        // Set the WxH to fit the Max values (but maintain proportions)
        if (width > height) {  
            if (width > MAX_WIDTH) {  
                height *= MAX_WIDTH / width;  
                width = MAX_WIDTH;  
            }  
        } else {  
            if (height > MAX_HEIGHT) {  
                width *= MAX_HEIGHT / height;  
                height = MAX_HEIGHT;  
            }  
        }
        // create a canvas object  
        var canvas = document.createElement("canvas");  
        // Set the canvas to the new calculated dimensions  
        canvas.width = width;  
        canvas.height = height;  
        var ctx = canvas.getContext("2d");  
        ctx.drawImage(img, 0, 0, width, height);  
        // Get this encoded as a jpeg  
        // IMPORTANT: 'jpeg' NOT 'jpg'  
        var dataUrl = canvas.toDataURL('image/jpeg');  
        // callback with the results  
        callback(dataUrl, img.src.length, dataUrl.length);  
    }; 
  }
}
