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
  orderBy = "name";
  publicPrivate;
  confirmedUnconfirmed;

  constructor(private showService: ShowService, private meService: MeService){}

  ngOnInit():void{
    this.getShowsEditable(1);
  }

  private getOptions(){
    let options = <any>{};
    options.sortby = this.orderBy;
    if(this.publicPrivate == "public"){
      options.public = 1;
    }else if(this.publicPrivate == "private"){
      options.private = 1;
    }

    if(this.confirmedUnconfirmed == "confirmed"){
      options.confirmed = 1
    }else if(this.confirmedUnconfirmed == "unconfirmed"){
      options.unconfirmed = 1;
    }
    return options;
  }

  getShowsEditable(page:number) {
    if(page < 0){
      return false;
    }
    let options = this.getOptions();
    this.showService.getShowsEditable(page, 100, options).then(shows => {
      this.shows = shows.json().data.data;
      let perPage = shows.json().data.per_page;
      let totalObjects = shows.json().data.total;
      this.pagination.setPage(page, perPage, totalObjects);
    }).catch(error => console.log(error));
  }

  public confirmShow(show){
    this.showService.confirmShow(show.id).then(response => {
      show.confirmed = 1;
    }).catch(error => console.log(error));
  }

  public setOrderBy(value){
    this.orderBy = value;
    this.getShowsEditable(1);
  }
  public setPublic(value){
    this.publicPrivate = value;
    this.getShowsEditable(1);
  }
  public setConfirmed(value){
    this.confirmedUnconfirmed = value;
    this.getShowsEditable(1);
  }
}
