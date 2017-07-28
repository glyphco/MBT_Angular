import { Component, OnInit } from '@angular/core';
import { HttpHandlerService } from '../_services/http-handler.service';
import { MeService } from '../_services/me.service';

@Component({
  selector: 'app-backstage',
  templateUrl: './backstage.component.html',
  styleUrls: ['./backstage.component.css']
})
export class BackstageComponent implements OnInit {
  eventsAll = '';
  eventsCurrent = '';
  eventsUnconfirmedCurrent = '';
  pagesAll = '';
  pagesUnconfirmed = '';
  showsAll = '';
  showsUnconfirmed = '';
  venuesAll = '';
  venuesUnconfirmed = '';
  usersAll = '';


  constructor(private httpHandlerService: HttpHandlerService, private meService:MeService){}

  ngOnInit(){
    this.getNumbers();
  }

  private getNumbers(){
    this.httpHandlerService.get('maintenance/numbers')
      .map(response => response.json().data)
      .toPromise()
      .then(response => {
        this.eventsAll = response.events.all;
        this.eventsCurrent = response.events.current;
        this.eventsUnconfirmedCurrent = response.events.unconfirmedcurrent;
        this.pagesAll = response.pages.all;
        this.pagesUnconfirmed = response.pages.unconfirmed;
        this.showsAll = response.shows.all;
        this.showsUnconfirmed = response.shows.unconfirmed;
        this.venuesAll = response.venues.all;
        this.venuesUnconfirmed = response.venues.unconfirmed;
        this.usersAll = response.users.all;
      }).catch(error => console.log(error));
  }
}
