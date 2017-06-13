import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { Show } from '../_models/show';
import { ShowService } from '../_services/show.service';

@Component({
  selector: 'app-show-edit',
  templateUrl: './show-edit.component.html',
  //styles: ['./page-edit.component.css']
})
export class ShowEditComponent implements OnInit, OnDestroy {
  show = new Show;
  private sub: any;
  categories = {};

  constructor(
    private showService:ShowService,
    private route: ActivatedRoute,
    private location: Location
  ){}

  ngOnInit():void{
    this.sub = this.route.params.subscribe(params => {
       let id = +params['id']; // (+) converts string 'id' to a number
       this.getShow(id);
    });
    this.getCategories();
  }

  ngOnDestroy():void {
    this.sub.unsubscribe();
  }

  public getShow(id:number){
    this.showService.getShow(id).then(show => {
      this.show = Show.map(show.json().data)
    }).catch(error => console.log(error));
  }

  private getCategories(){
    //TODO: move getCategories into it's own service or helper
    this.showService.getCategories().then(categories => this.categories = categories.json().data)
      .catch(error => console.log(error));
  }

  public onSubmit(){
    this.showService.updateShow(this.show).then(response => {

    }).catch(error => console.log(error));
    console.log('the form was submitted');
  }
}
