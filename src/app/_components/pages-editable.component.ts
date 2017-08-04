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

  constructor(private pageService:PageService, private router:Router, private meService: MeService){}

  ngOnInit():void{
    this.getPagesEditable(1)
  }

  public getPagesEditable(page:number){
    this.pageService.getPagesEditable(page).then(pages => {
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
}
