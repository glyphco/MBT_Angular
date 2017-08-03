import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';
import { PageService } from '../_services/page.service';

@Component({
  selector: 'app-page-delete',
  template: `
    <div class="container white">
      <h3>You are about to delete a page.</h3>
      <h4>Are you sure you want to do this?</h4>
      <button class="btn btn-danger" (click)="deletePage()">Confirm delete</button>
      <button class="btn btn-primary" (click)="goBack()">Back</button>
    </div>
  `
})
export class PageDeleteComponent implements OnInit, OnDestroy {
  pageId:any;
  private sub: any;

  constructor(
    private pageService:PageService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router
  ){}

  ngOnInit():void {
    //get the current page
    this.sub = this.route.params.subscribe(params => {
       let id = +params['id']; // (+) converts string 'id' to a number
       this.pageId = id;
    });
  }

  ngOnDestroy():void {
    this.sub.unsubscribe();
  }

  deletePage(){
    //put the delete code here
    this.pageService.deletePage(this.pageId).then(response => {
      this.router.navigate(['/backstage']);
    }).catch(error => console.log(error));
  }

  public goBack(): void {
    this.location.back();
  }
}
