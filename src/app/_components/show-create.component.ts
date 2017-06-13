import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { Show } from '../_models/show';
import { ShowService } from '../_services/show.service';

@Component({
  selector: 'app-show-create',
  templateUrl: './show-create.component.html',
  //styles: ['./page-edit.component.css']
})
export class ShowCreateComponent {
  show = new Show;

  constructor(
    private showService:ShowService,
    private route: ActivatedRoute,
    private location: Location
  ){}

  public goBack(): void {
    this.location.back();
  }

  public onSubmit(){
    this.createShow();
  }

  private createShow(){
    this.showService.createShow(this.show).then(response => {
      
    }).catch(error => console.log(error));
    console.log('the form was submitted');
  }
}
