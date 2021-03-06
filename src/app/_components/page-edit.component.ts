import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Page } from '../_models/page';
import { PageService } from '../_services/page.service';
import { MeService } from '../_services/me.service';
import { StatesHelper } from '../_helpers/states-helper';
import { ImageUploadService } from '../_services/image-upload.service';
import { AnnouncementService } from '../_services/announcement.service';

@Component({
  selector: 'app-page-edit',
  templateUrl: './page-edit.component.html',
  styleUrls: ['./backstage.component.css']
})
export class PageEditComponent implements OnInit, OnDestroy {
  page = new Page();
  private sub: any;
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
    private imageUploadService:ImageUploadService,
    private announcementService:AnnouncementService
  ){}

  ngOnInit():void{
    this.sub = this.route.params.subscribe(params => {
      this.page = new Page();
      this.pageCategories = [];
      this.image = undefined;
      this.previewImage = undefined;

      let id = +params['id']; // (+) converts string 'id' to a number
      this.getPageEdit(id);
    });
  }

  ngOnDestroy():void {
    this.sub.unsubscribe();
  }

  public getPageEdit(id:number){
    this.pageService.getPageEdit(id).then(page => {
      this.page = Page.map(page.json().data);
      this.pageCategories = this.page.categoriesJson ? JSON.parse(this.page.categoriesJson) : [];
    }).catch(error => console.log(error));
  }

  public onSubmit(){
    this.uploadImageIfExist().then((imageUrl:any) => {
      if(imageUrl){
        this.page.imageUrl = imageUrl;
        console.log(imageUrl);
      }
      return this.pageService.updatePage(this.page, this.pageCategories);
    }).then(response => {
      this.router.navigate(['/pages/editable']);
    }).catch(error => this.announcementService.openToasterApiError(error));
  }

  private uploadImageIfExist():Promise<any>{
    if(this.image){
      console.log('image uploading');
      return this.imageUploadService.uploadImageToS3(this.image, 'page', this.page.id, 'main');
    }
    return Promise.resolve(false);
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
