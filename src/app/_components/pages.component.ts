import { Component, OnInit } from '@angular/core';
import { Page } from '../_models/page';
import { PageService } from '../_services/page.service';
import { Pagination } from '../_helpers/pagination';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./events.component.css']
})
export class PagesComponent implements OnInit {
  pagination = new Pagination();
  pages: Page[];

  constructor(private pageService:PageService){}

  ngOnInit():void{
    this.getPages(1)
  }
  
  public getPages(page:number){
    this.pageService.getPages(page).then(pages => {
      this.pages = Page.arrayMap(pages.json().data.data)
      let perPage = pages.json().data.per_page;
      let totalObjects = pages.json().data.total;
      this.pagination.setPage(page, perPage, totalObjects);
    }).catch(error => console.log(error));
  }
}
