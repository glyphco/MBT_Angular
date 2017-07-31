import { Component, OnInit } from '@angular/core';
import { ShowService } from '../_services/show.service';
import { MeService } from '../_services/me.service';
import { Show } from '../_models/show';
import { Pagination } from '../_helpers/pagination';

@Component({
  selector: 'app-shows',
  templateUrl: './shows-editable.component.html',
  styleUrls: ['./events-editable.component.css']
})
export class ShowsEditableComponent implements OnInit {
  
  pagination = new Pagination();
  shows: Show[];

  constructor(private showService: ShowService, private meService: MeService){}

  ngOnInit():void{
    this.getShowsEditable(1);
  }

  getShowsEditable(page:number):void {
    this.showService.getShowsEditable(page).then(shows => {
      this.shows = Show.arrayMap(shows.json().data.data);
      let perPage = shows.json().data.per_page;
      let totalObjects = shows.json().data.total;
      this.pagination.setPage(page, perPage, totalObjects);
    }).catch(error => console.log(error));
  }
}
