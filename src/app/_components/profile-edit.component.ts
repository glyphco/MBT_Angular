import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MeService } from '../_services/me.service';
import { HttpHandlerService } from '../_services/http-handler.service';
import { User } from '../_models/user';
import { UserService } from '../_services/user.service';
import { AnnouncementService } from '../_services/announcement.service';
import { ImageUploadService } from '../_services/image-upload.service';
import { DateTime } from '../_helpers/date-time.service';
import { StatesHelper } from '../_helpers/states-helper';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./backstage.component.css']
})
export class ProfileEditComponent implements OnInit {
  role = 'nothing';
  message:string;
  states = StatesHelper.states;
  user = new User();
  image:any;
  previewImage:any;

  constructor(
    private meService: MeService,
    private router: Router,
    private httpHandlerService:HttpHandlerService,
    private imageUploadService:ImageUploadService,
    private announcementService:AnnouncementService
  ){}

  ngOnInit():void{
    let id = this.meService.id;
    this.getMeEdit(id);
  }

  public getMeEdit(id:number){
    this.meService.getMeEdit(id).then(user => {
      this.user = User.map(user.data);
      console.log(this.user);
    }).catch(error => console.log(error));
  }

  public onSubmit(){
    if(this.image){
      this.imageUploadService.uploadImageToS3(this.image, 'user', this.user.id, 'main').then((imageUrl:string) => {
        this.user.imageUrl = imageUrl;
        return this.meService.updateMe(this.user);
      }).then(response => {
        this.router.navigate(['/user', this.user.id]);
      }).catch(error => this.announcementService.openToasterApiError(error));
    }else{
      this.meService.updateMe(this.user).then(response => {
        this.router.navigate(['/user', this.user.id]);
      }).catch(error => this.announcementService.openToasterApiError(error));
    }
  }

  public fileChange(imageField){
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

  public saveRole(){
    this.httpHandlerService.get(`me/makeme/${this.role}`)
      .map(response => response.json())
      .toPromise()
      .then(response => this.announcementService.openToasterSuccess(response.data))
      .catch(error => this.announcementService.openToasterError('Role change failed'))
  }
}
