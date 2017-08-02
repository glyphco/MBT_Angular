import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Show } from '../_models/show';
import { ShowService } from '../_services/show.service';
import { MeService } from '../_services/me.service';

@Component({
  selector: 'app-show-edit',
  templateUrl: './show-edit.component.html',
  //styles: ['./page-edit.component.css']
})
export class ShowEditComponent implements OnInit, OnDestroy {
  show = new Show;
  private sub: any;
  showCategories = [];

  constructor(
    private showService:ShowService,
    private route: ActivatedRoute,
    private location: Location,
    private meService: MeService,
    private router: Router
  ){}

  ngOnInit():void{
    this.sub = this.route.params.subscribe(params => {
       let id = +params['id']; // (+) converts string 'id' to a number
       this.getShowEdit(id);
    });
  }

  ngOnDestroy():void {
    this.sub.unsubscribe();
  }

  public getShowEdit(id:number){
    this.showService.getShowEdit(id).then(show => {
      this.show = Show.map(show.json().data);
      this.showCategories = this.show.categoriesJson ? JSON.parse(this.show.categoriesJson) : [];
    }).catch(error => console.log(error));
  }

  public onSubmit(){
    this.showService.updateShow(this.show, this.showCategories).then(response => {
      this.router.navigate(['/backstage']);
    }).catch(error => console.log(error));
    console.log('the form was submitted');
  }

  public deleteShow(){
    this.showService.deleteShow(this.show.id).then(response => {
      this.router.navigate(['/backstage']);
    }).catch(error => console.log(error));
  }
}
