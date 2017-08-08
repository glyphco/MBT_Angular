import { Component, OnInit } from '@angular/core';
import { Router }   from '@angular/router';
import { Page } from '../_models/page';
import { PageService } from '../_services/page.service';
import { Pagination } from '../_helpers/pagination';
import { MeService } from '../_services/me.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages-editable.component.html',
  styleUrls: ['./events-editable.component.css']
})
export class PagesEditableComponent implements OnInit {
  pagination = new Pagination();
  pages: Page[];
  orderBy = "name";
  publicPrivate;
  confirmedUnconfirmed;

  constructor(private pageService:PageService, private router:Router, private meService: MeService){}

  ngOnInit():void{
    this.getPagesEditable(1)
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

  public getPagesEditable(page:number){
    let options = this.getOptions();
    this.pageService.getPagesEditable(page, 100, options).then(pages => {
      this.pages = pages.json().data.data;
      let perPage = pages.json().data.per_page;
      let totalObjects = pages.json().data.total;
      this.pagination.setPage(page, perPage, totalObjects);
    }).catch(error => console.log(error));
  }

  public confirmPage(page){
    this.pageService.confirmPage(page.id).then(response => {
      page.confirmed = 1;
    }).catch(error => console.log(error));
  }

  public setOrderBy(value){
    this.orderBy = value;
    this.getPagesEditable(1);
  }
  public setPublic(value){
    this.publicPrivate = value;
    this.getPagesEditable(1);
  }
  public setConfirmed(value){
    this.confirmedUnconfirmed = value;
    this.getPagesEditable(1);
  }
}
