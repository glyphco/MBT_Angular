import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Page } from '../_models/page';
import { PageService } from '../_services/page.service';
import { MeService } from '../_services/me.service';
import { StatesHelper } from '../_helpers/states-helper';

@Component({
  selector: 'app-page-edit',
  templateUrl: './page-edit.component.html',
  //styles: ['./page-edit.component.css']
})
export class PageEditComponent implements OnInit, OnDestroy {
  page = new Page;
  private sub: any;
  states = StatesHelper.states;
  pageCategories = [];

  constructor(
    private pageService:PageService,
    private route: ActivatedRoute,
    private location: Location,
    private meService: MeService,
    private router: Router
  ){}

  ngOnInit():void{
    this.sub = this.route.params.subscribe(params => {
       let id = +params['id']; // (+) converts string 'id' to a number
       this.getPageEdit(id);
    });
  }

  ngOnDestroy():void {
    this.sub.unsubscribe();
  }

  public getPageEdit(id:number){
    this.pageService.getPageEdit(id).then(page => {
      this.page = Page.map(page.json().data);
      this.pageCategories = this.page.categoriesJson ? JSON.parse(this.page.categoriesJson) : [];
    }).catch(error => console.log(error));
  }

  public onSubmit(){
    this.pageService.updatePage(this.page, this.pageCategories).then(response => {
      this.router.navigate(['/backstage']);
    }).catch(error => console.log(error));
  }

  public deletePage(){
    this.pageService.deletePage(this.page.id).then(response => {
      this.router.navigate(['/backstage']);
    }).catch(error => console.log(error));
  }
}
