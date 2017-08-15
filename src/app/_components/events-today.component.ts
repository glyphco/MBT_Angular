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

  constructor(
    private eventService:EventService, 
    private locationService: LocationService,
    @Inject(DOCUMENT) private document: Document
  ){}

  ngOnInit():void{
    //Set up Google map
    this.map = new google.maps.Map(document.getElementById('sidebar-map'));
    this.map.setCenter({lat: this.locationService.getLat(), lng: this.locationService.getLng()});
    this.setMapZoom();

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
    console.log(width);
    if (scrollTop > 150 && width > 800) {
      //adjust map top
      let mapTop = scrollTop - 150;
      mapContainer.style.top = String(mapTop) + 'px';
    } else if(scrollTop < 100 || width < 800){
      mapContainer.style.top = '0px';
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
      this.events = this.events.concat(events.data);
      let perPage = events.per_page;
      let totalObjects = events.total;
      this.pagination.setPage(page, perPage, totalObjects);
    }).catch(error => console.log(error));
  }

  private populateMap(){
    //Get map points for events today
    this.eventService.getEventsTodayPoints().then(response => {

    }).catch(error => console.log(error));
    for (let event of this.events){
      console.log(event);
      new google.maps.Marker({
        map: this.map,
        //anchorPoint: new google.maps.Point(latitude, longitude),
        position: {lat: event.lat, lng: event.lng}
      });
    }
  }

  private setMapZoom(){
    switch(+this.locationService.getDist()) {
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
}