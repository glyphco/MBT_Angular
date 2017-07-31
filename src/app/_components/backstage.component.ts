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
        this.eventsAll = response.events && response.events.all ? response.events.all : '';
        this.eventsCurrent = response.events && response.events.current ? response.events.current : '';
        this.eventsUnconfirmedCurrent = response.events && response.events.unconfirmedcurrent ? response.events.unconfirmedcurrent : '';
        this.pagesAll = response.pages && response.pages.all ? response.pages.all : '';
        this.pagesUnconfirmed = response.pages &&  response.pages.unconfirmed ? response.pages.unconfirmed : '';
        this.showsAll = response.shows &&  response.shows.all ? response.shows.all : '';
        this.showsUnconfirmed = response.shows && response.shows.unconfirmed ? response.shows.unconfirmed : '';
        this.venuesAll = response.venues && response.venues.all ? response.venues.all : '';
        this.venuesUnconfirmed = response.venues && response.venues.unconfirmed ? response.venues.unconfirmed : '';
        this.usersAll = response.users && response.users.all ? response.users.all : '';
      }).catch(error => console.log(error));
  }
}
