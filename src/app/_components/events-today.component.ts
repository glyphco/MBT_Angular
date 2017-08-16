import { Component, OnInit, OnDestroy, HostListener, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Event } from '../_models/event';
import { EventService } from '../_services/event.service';
import { LocationService } from '../_services/location.service';
import { Pagination } from '../_helpers/pagination';
import { Subscription }   from 'rxjs/Subscription';

declare var google:any;

@Component({
  selector: 'app-events-today',
  templateUrl: './events-today.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsTodayComponent implements OnInit, OnDestroy {
  pagination = new Pagination();
  subscription: Subscription;
  events = [];
  location = this.locationService.getLocationName();
  loadingIndicatorVisible = false;
  map:any;
  markers = [];
  circle:any;

  constructor(
    private eventService:EventService, 
    private locationService: LocationService,
    @Inject(DOCUMENT) private document: Document
  ){}

  ngOnInit():void{
    //Set up Google map
    this.map = new google.maps.Map(document.getElementById('sidebar-map'), {
      disableDefaultUI: true
    });
    this.map.setCenter({lat: this.locationService.getLat(), lng: this.locationService.getLng()});

    //Get events
    this.getEvents(1);
    this.subscription = this.locationService.locationChange$.subscribe(change => {
        //refresh list when location changes
        this.getEvents(1);
    });
  }

  ngOnDestroy():void{
    this.subscription.unsubscribe();
  }

  //Track page scroll to dynamically move the map
  @HostListener("window:scroll", [])
  onWindowScroll() {
    let scrollTop = this.document.body.scrollTop;
    let width = this.document.body.clientWidth;
    let mapContainer = this.document.getElementById("sidebar-map");
    if (scrollTop > 150 && width > 900) {
      mapContainer.style.position = 'fixed';
      mapContainer.style.top = '15px';
      mapContainer.style.width = '250px';
    } else if(scrollTop <= 150 || width < 900){
      mapContainer.style.width = 'auto';
      mapContainer.style.position = 'relative';
    }
  }

  public trackEvent(index, event){
    return event.id;
  }

  public getEvents(page:number){
    this.loadingIndicatorVisible = true;
    this.eventService.getEventsToday(page).then(events => {
      this.events = Event.arrayMap(events.data);
      let perPage = events.per_page;
      let totalObjects = events.total;
      this.pagination.setPage(page, perPage, totalObjects);
      this.loadingIndicatorVisible = false;
      console.log(this.events);

      //Populate Google map
      this.populateMap();
    }).catch(error => {
      this.loadingIndicatorVisible = false;
      console.log(error);
    });
  }

  public loadNextPage(){
    let page = this.pagination.currentPage + 1;
    this.eventService.getEventsToday(page).then(events => {
      this.events = this.events.concat(Event.arrayMap(events.data));
      let perPage = events.per_page;
      let totalObjects = events.total;
      this.pagination.setPage(page, perPage, totalObjects);
    }).catch(error => console.log(error));
  }

  private populateMap(){
    //Get map points for events today
    this.eventService.getEventsTodayPoints().then(points => {
      let allBounds = new google.maps.LatLngBounds();
      let insideBounds = new google.maps.LatLngBounds();

      this.circle = new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillOpacity:0.1,
        center: {lat: this.locationService.getLat(), lng: this.locationService.getLng()},
        radius: this.locationService.getDistMeters(),
        map: this.map
      });

      for(let point of points){
        let icon:any;
        //Outside of distance
        if(point.distance > this.locationService.getDistMeters()){
          icon = {
            path: google.maps.SymbolPath.CIRCLE,
            scale:4,
            fillColor: '#125ebc',
            fillOpacity:0.8,
            strokeColor:'#fff',
            strokeWeight:1,
            strokeOpacity:1
          };
        }else{
          //Marker inside of user's chosen distance
          icon = {
            path: google.maps.SymbolPath.CIRCLE,
            scale:4,
            fillColor: '#ff0000',
            fillOpacity:0.8,
            strokeColor:'#fff',
            strokeWeight:1,
            strokeOpacity:1
          }
        }
        let marker = new google.maps.Marker({
          map: this.map,
          icon: icon,
          position: {lat: +point.lat, lng: +point.lng}
        });

        this.markers.push(marker);
        allBounds.extend(marker.getPosition());
        if(point.distance > this.locationService.getDistMeters()){
          insideBounds.extend(marker.getPosition());
        }
      }
      //MARK: These allow us to change map bounds. Just uncomment the one you want
      //this.map.fitBounds(allBounds);
      //this.map.fitBounds(insideBounds);
      this.map.fitBounds(this.circle.getBounds());
      //This will make the map work when the flex box wraps map to top on page load
      google.maps.event.trigger(this.map, 'resize');
    }).catch(error => console.log(error));
  }
}