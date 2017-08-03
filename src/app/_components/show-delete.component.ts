import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ShowService } from '../_services/show.service';

@Component({
  selector: 'app-show-delete',
  template: `
    <div class="container white">
      <h3>You are about to delete a show.</h3>
      <h4>Are you sure you want to do this?</h4>
      <button class="btn btn-danger" (click)="deleteShow()">Confirm delete</button>
      <button class="btn btn-primary" (click)="goBack()">Back</button>
    </div>
  `
})
export class ShowDeleteComponent implements OnInit, OnDestroy {
  showId:any;
  private sub: any;

  constructor(
    private showService:ShowService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router
  ){}

  ngOnInit():void {
    //get the current show
    this.sub = this.route.params.subscribe(params => {
       let id = +params['id']; // (+) converts string 'id' to a number
       this.showId = id;
    });
  }

  ngOnDestroy():void {
    this.sub.unsubscribe();
  }

  deleteShow(){
    //put the delete code here
    this.showService.deleteShow(this.showId).then(response => {
      this.router.navigate(['/backstage']);
    }).catch(error => console.log(error));
  }

  public goBack(): void {
    this.location.back();
  }
}
