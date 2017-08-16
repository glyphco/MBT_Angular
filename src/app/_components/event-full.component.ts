import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';
import { EventService } from '../_services/event.service';

@Component({
  selector: 'app-event-full',
  template: `
    <div class="container white">
      <ul>
        <!--
        <li>id: {{event.id}}</li>
        <li>mve_id: {{event.mve_id}}</li>
        -->
        <li>name: {{event.name}}</li>
        <li>description: {{event.description}}</li>
        <li>showsjson: {{event.showsjson}}</li>
        <li>categoriesjson: {{event.categoriesjson}}</li>
        <li>participantsjson: {{event.participantsjson}}</li>
        <li>venue_id: {{event.venue_id}}</li>
        <li>venue_name: {{event.venue_name}}</li>
        <li>street_address: {{event.street_address}}</li>
        <li>city: {{event.city}}</li>
        <li>state: {{event.state}}</li>
        <li>postalcode: {{event.postalcode}}</li>
        <li>lat: {{event.lat}}</li>
        <li>lng: {{event.lng}}</li>
        <li>local_tz: {{event.local_tz}}</li>
        <li>venue_tagline: {{event.venue_tagline}}</li>
        <li>price: {{event.price}}</li>
        <li>pricemin: {{event.pricemin}}</li>
        <li>pricemax: {{event.pricemax}}</li>
        <li>pricedescription: {{event.pricedescription}}</li>
        <li>pricelink: {{event.pricelink}}</li>
        <li>ages: {{event.ages}}</li>
        <!--
        <li>UTC_start: {{event.UTC_start}}</li>
        <li>UTC_end: {{event.UTC_end}}</li>
        -->
        <li>local_start: {{event.local_start}}</li>
        <li>local_end: {{event.local_end}}</li>
        <li>info: {{event.info}}</li>
        <li>private_info: {{event.private_info}}</li>
        <li>order: {{event.order}}</li>
        <li>public: {{event.public}}</li>
        <li>confirmed: {{event.confirmed}}</li>
        <li>imageurl: {{event.imageurl}}</li>
        <li>backgroundurl: {{event.backgroundurl}}</li>
        <li>created_at: {{event.created_at}}</li>
        <li>updated_at: {{event.updated_at}}</li>
        <li>created_by: {{event.created_by}}</li>
        <li>updated_by: {{event.updated_by}}</li>
        <li>location: {{event.location}}</li>
        <li>attendingyes_count: {{event.attendingyes_count}}</li>
        <li>attendingmaybe_count: {{event.attendingmaybe_count}}</li>
        <li>attendingwish_count: {{event.attendingwish_count}}</li>
        <li>pyfsattendingyes_count: {{event.pyfsattendingyes_count}}</li>
        <li>pyfsattendingmaybe_count: {{event.pyfsattendingmaybe_count}}</li>
        <li>pyfsattendingwish_count: {{event.pyfsattendingwish_count}}</li>
        <li>mve: {{event.mve}}</li>
        <li>venue: {{event.venue}}</li>
        <li>eventshows: {{event.eventshows}}</li>
        <li>categories: {{event.categories}}</li>
        <li>eventparticipants: {{event.eventparticipants}}</li>
        <li>eventproducer: {{event.eventproducer}}</li>
        <li>attendingyes: {{event.attendingyes}}</li>
        <li>attendingmaybe: {{event.attendingmaybe}}</li>
        <li>attendingwish: {{event.attendingwish}}</li>
        <li>pyfsattendingyes: {{event.pyfsattendingyes}}</li>
        <li>pyfsattendingmaybe: {{event.pyfsattendingmaybe}}</li>
        <li>pyfsattendingwish: {{event.pyfsattendingwish}}</li>
      </ul>
    </div>
  `
})
export class EventFullComponent implements OnInit, OnDestroy {
  eventId:any;
  event:any;
  private sub: any;

  constructor(
    private eventService:EventService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router
  ){}

  ngOnInit():void {
    //get the current event
    this.sub = this.route.params.subscribe(params => {
       let id = +params['id']; // (+) converts string 'id' to a number
       this.eventId = id;
       this.getEventFull(id);
    });
  }

  ngOnDestroy():void {
    this.sub.unsubscribe();
  }

  private getEventFull(id){
    this.eventService.getEventFull(id).then(event => {
      this.event = event;
    }).catch(error => console.log(error));
  }

  public goBack(): void {
    this.location.back();
  }
}
