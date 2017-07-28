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
