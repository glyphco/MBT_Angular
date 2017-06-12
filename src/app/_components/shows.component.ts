import { Component, OnInit } from '@angular/core';
import { ShowService } from '../_services/show.service';
import { Show } from '../_models/show';
import { Pagination } from '../_helpers/pagination';

@Component({
  selector: 'app-shows',
  templateUrl: './shows.component.html',
  styleUrls: ['./events.component.css']
})
export class ShowsComponent implements OnInit {
  
  pagination = new Pagination();
  shows: Show[];

  constructor(private showService: ShowService){}

  ngOnInit():void{
    this.getShows(1);
  }

  getShows(page:number):void {
    this.showService.getShows(page).then(shows => {
      this.shows = Show.arrayMap(shows.json().data.data);
      let perPage = shows.json().data.per_page;
      let totalObjects = shows.json().data.total;
      this.pagination.setPage(page, perPage, totalObjects);
    }).catch(error => console.log(error));
  }
}
