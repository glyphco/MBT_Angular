import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { Show } from '../_models/show';
import { ShowService } from '../_services/show.service';

@Component({
  selector: 'app-show-detail',
  templateUrl: './show-detail.component.html',
  //styleUrls: ['./events.component.css']
})
export class ShowDetailComponent implements OnInit, OnDestroy {
  show: Show;
  private sub: any;

  constructor(
    private showService:ShowService,
    private route: ActivatedRoute,
    private location: Location
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
    this.showService.getShow(id).then(show => {
      this.show = Show.map(show.json().data);
    }).catch(error => console.log(error));
  }
}
