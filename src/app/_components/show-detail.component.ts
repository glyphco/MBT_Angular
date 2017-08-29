import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { Show } from '../_models/show';
import { ShowService } from '../_services/show.service';
import { ErrorHandlerService } from '../_services/error-handler.service';

@Component({
  selector: 'app-show-detail',
  templateUrl: './show-detail.component.html',
  styleUrls: ['./lists.component.css']
})
export class ShowDetailComponent implements OnInit, OnDestroy {
  show: Show;
  private sub: any;

  constructor(
    private showService:ShowService,
    private route: ActivatedRoute,
    private location: Location,
    private errorHandlerService: ErrorHandlerService
  ){}

  ngOnInit():void {
    this.sub = this.route.params.subscribe(params => {
       let id = +params['id']; // (+) converts string 'id' to a number
       this.getShow(id);
    });
  }

  ngOnDestroy():void {
    this.sub.unsubscribe();
  }

  goBack(): void {
    this.location.back();
  }

  private getShow(id:number){
    this.showService.getShowDetails(id).then(show => {
      this.show = Show.map(show);
      console.log(this.show);
    }).catch(error => console.log(error));
  }

  public likeItem(){
    let id = this.show.id;
    let originalValue = this.show.iLike;
    this.show.iLike = +!originalValue; //toggle button
    this.showService.likeShow(id).catch(error => {
      this.show.iLike = originalValue;
      this.errorHandlerService.openToasterApiError(error);
    });
  }
}
