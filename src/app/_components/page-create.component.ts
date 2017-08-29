import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Page } from '../_models/page';
import { PageService } from '../_services/page.service';
import { StatesHelper } from '../_helpers/states-helper';
import { MeService } from '../_services/me.service';
import { ImageUploadService } from '../_services/image-upload.service';
import { AnnouncementService } from '../_services/announcement.service';

@Component({
  selector: 'app-page-create',
  templateUrl: './page-create.component.html',
  styleUrls: ['./backstage.component.css']
})
export class PageCreateComponent {
  page = new Page;
  states = StatesHelper.states;
  pageCategories = [];
  image:any;
  previewImage:any;

  constructor(
    private pageService:PageService,
    private route: ActivatedRoute,
    private location: Location,
    private meService: MeService,
    private router: Router,
    private imageUploadService: ImageUploadService,
    private announcementService: AnnouncementService
  ){}

  public goBack(): void {
    this.location.back();
  }

  public onSubmit(){
    this.createPage();
  }

  private createPage(){
    this.pageService.createPage(this.page, this.pageCategories).then(response => {
      this.page.id = response.data.id;
      return this.image ? this.imageUploadService.uploadImageToS3(this.image, 'page', this.page.id, 'main')
        : Promise.resolve(false);
    }).then((imageUrl:string) => {
      if(imageUrl){
        this.page.imageUrl = imageUrl;
        return this.pageService.updatePage(this.page, this.pageCategories);
      }else{
        return Promise.resolve(true);
      }
    }).then(response => {
      this.router.navigate(['/pages/editable']);
    }).catch(error => this.announcementService.openToasterApiError(error));
  }

  fileChange(imageField){
    if(0 in imageField.files){
      //store file temporarily
      this.image = imageField.files[0];

      this.imageUploadService.readUrl(imageField.files[0], (result) => {
        this.previewImage = result;
      });
    } else {
      this.previewImage = undefined;
    }
  }
}