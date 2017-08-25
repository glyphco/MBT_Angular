import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Show } from '../_models/show';
import { ShowService } from '../_services/show.service';
import { MeService } from '../_services/me.service';
import { ImageUploadService } from '../_services/image-upload.service';

@Component({
  selector: 'app-show-create',
  templateUrl: './show-create.component.html',
  //styleUrls: ['./show-create.component.css']
})
export class ShowCreateComponent {
  show = new Show;
  categoriesList = [];
  showCategories = [];
  image:any;

  constructor(
    private showService:ShowService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private meService: MeService,
    private imageUploadService:ImageUploadService
  ){}

  public goBack(): void {
    this.location.back();
  }

  public onSubmit(){
    this.createShow();
  }

  private createShow(){
    this.showService.createShow(this.show, this.showCategories).then(response => {
      this.show.id = response.data.id;
      return this.image ? this.imageUploadService.uploadImageToS3(this.image, 'show', this.show.id, 'main')
        : Promise.resolve(false);
    }).then((imageUrl:string) => {
      if(imageUrl){
        this.show.imageUrl = imageUrl;
        return this.showService.updateShow(this.show, this.showCategories);
      }else{
        return Promise.resolve(true);
      }
    }).then(response => {
      this.router.navigate(['/shows/editable']);
    }).catch(error => console.log(error));
  }

  fileChange(imageField){
    //store file temporarily
    this.image = imageField.files[0];
  }
}
