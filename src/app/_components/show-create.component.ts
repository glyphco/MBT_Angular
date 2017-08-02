import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Show } from '../_models/show';
import { ShowService } from '../_services/show.service';
import { MeService } from '../_services/me.service';

@Component({
  selector: 'app-show-create',
  templateUrl: './show-create.component.html',
  //styleUrls: ['./show-create.component.css']
})
export class ShowCreateComponent {
  show = new Show;
  categoriesList = [];
  showCategories = [];

  constructor(
    private showService:ShowService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private meService: MeService
  ){}

  public goBack(): void {
    this.location.back();
  }

  public onSubmit(){
    this.createShow();
  }

  private createShow(){
    this.showService.createShow(this.show, this.showCategories).then(response => {
      this.router.navigate(['/backstage']);
    }).catch(error => console.log(error));
    console.log('the form was submitted');
  }
}
