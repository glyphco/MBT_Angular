import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Show } from '../_models/show';
import { ShowService } from '../_services/show.service';
import { MeService } from '../_services/me.service';
import { ImageUploadService } from '../_services/image-upload.service';

@Component({
  selector: 'app-show-edit',
  templateUrl: './show-edit.component.html',
  styleUrls: ['./backstage.component.css']
})
export class ShowEditComponent implements OnInit, OnDestroy {
  show = new Show;
  private sub: any;
  showCategories = [];
  image:any;
  previewImage:any;

  constructor(
    private showService:ShowService,
    private route: ActivatedRoute,
    private location: Location,
    private meService: MeService,
    private router: Router,
    private imageUploadService:ImageUploadService
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
    this.uploadImageIfExist().then((imageUrl:any) => {
      if(imageUrl){
        this.show.imageUrl = imageUrl;
      }
      return this.showService.updateShow(this.show, this.showCategories);
    }).then(response => {
      this.router.navigate(['/shows/editable']);
    }).catch(error => console.log(error));
  }

  public deleteShow(){
    this.showService.deleteShow(this.show.id).then(response => {
      this.router.navigate(['/backstage']);
    }).catch(error => console.log(error));
  }

  private uploadImageIfExist():Promise<any>{
    if(this.image){
      return this.imageUploadService.uploadImageToS3(this.image, 'show', this.show.id, 'main');
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
