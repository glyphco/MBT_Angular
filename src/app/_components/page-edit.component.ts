import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { Page } from '../_models/page';
import { PageService } from '../_services/page.service';
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
  categories = {};

  constructor(
    private pageService:PageService,
    private route: ActivatedRoute,
    private location: Location
  ){}

  ngOnInit():void{
    this.sub = this.route.params.subscribe(params => {
       let id = +params['id']; // (+) converts string 'id' to a number
       this.getPage(id);
    });
    this.getCategories();
  }

  ngOnDestroy():void {
    this.sub.unsubscribe();
  }

  public getPage(id:number){
    this.pageService.getPage(id).then(page => {
      this.page = Page.map(page.json().data)
    }).catch(error => console.log(error));
  }

  private getCategories(){
    this.pageService.getCategories().then(categories => this.categories = categories.json().data)
      .catch(error => console.log(error));
  }

  public onSubmit(){
    this.pageService.updatePage(this.page).then(response => {

    }).catch(error => console.log(error));
    console.log('the form was submitted');
  }
}
