import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { Page } from '../_models/page';
import { PageService } from '../_services/page.service';
import { StatesHelper } from '../_helpers/states-helper';
import { MeService } from '../_services/me.service';

@Component({
  selector: 'app-page-create',
  templateUrl: './page-create.component.html',
  //styleUrls: ['./page-edit.component.css']
})
export class PageCreateComponent {
  page = new Page;
  states = StatesHelper.states;

  constructor(
    private pageService:PageService,
    private route: ActivatedRoute,
    private location: Location,
    private meService: MeService
  ){}

  public goBack(): void {
    this.location.back();
  }

  public onSubmit(){
    this.createPage();
  }

  private createPage(){
    this.pageService.createPage(this.page).then(response => {
      
    }).catch(error => console.log(error));
  }
}
