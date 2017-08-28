import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { Page } from '../_models/page';
import { PageService } from '../_services/page.service';
import { ErrorHandlerService } from '../_services/error-handler.service';

@Component({
  selector: 'app-page-detail',
  templateUrl: './page-detail.component.html',
  styleUrls: ['./lists.component.css']
})
export class PageDetailComponent implements OnInit, OnDestroy {
  page: Page;
  private sub: any;

  constructor(
    private pageService:PageService,
    private route: ActivatedRoute,
    private location: Location,
    private errorHandlerService:ErrorHandlerService
  ){}

  ngOnInit():void {
    this.sub = this.route.params.subscribe(params => {
       let id = +params['id']; // (+) converts string 'id' to a number
       this.getPage(id);
    });
  }

  ngOnDestroy():void {
    this.sub.unsubscribe();
  }

  goBack(): void {
    this.location.back();
  }

  private getPage(id:number){
    this.pageService.getPageDetails(id).then(page => {
      this.page = Page.map(page);
            console.log(this.page);
    }).catch(error => console.log(error));
  }

  public likeItem(){
    let id = this.page.id;
    this.pageService.likePage(id).then(reponse => {
      
    }).catch(error => this.errorHandlerService.openToasterApiError(error));
  }
}
