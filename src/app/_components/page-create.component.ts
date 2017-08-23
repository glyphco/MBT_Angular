import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Page } from '../_models/page';
import { PageService } from '../_services/page.service';
import { StatesHelper } from '../_helpers/states-helper';
import { MeService } from '../_services/me.service';
import { ImageUploadService } from '../_services/image-upload.service';

@Component({
  selector: 'app-page-create',
  templateUrl: './page-create.component.html',
  //styleUrls: ['./page-create.component.css']
})
export class PageCreateComponent {
  page = new Page;
  states = StatesHelper.states;
  pageCategories = [];

  constructor(
    private pageService:PageService,
    private route: ActivatedRoute,
    private location: Location,
    private meService: MeService,
    private router: Router,
    private imageUploadService: ImageUploadService
  ){}

  public goBack(): void {
    this.location.back();
  }

  public onSubmit(){
    this.createPage();
  }

  private createPage(){
    this.pageService.createPage(this.page, this.pageCategories).then(response => {
      this.router.navigate(['/backstage']);
    }).catch(error => console.log(error));
  }

  fileChange(imageField){
    let files = imageField.files;
    if(0 in files){
      this.imageUploadService.uploadImageToS3(files[0], 'page', 1,'main', 50,100).then(response => {
        console.log(response);
      }).catch(error => console.log(error));
    }
  }

  

}
