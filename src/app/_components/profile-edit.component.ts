import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MeService } from '../_services/me.service';
import { HttpHandlerService } from '../_services/http-handler.service';
import { User } from '../_models/user';
import { UserService } from '../_services/user.service';
import { ImageUploadService } from '../_services/image-upload.service';
import { DateTime } from '../_helpers/date-time.service';
import { StatesHelper } from '../_helpers/states-helper';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  //styleUrls: ['./events-editable.component.css']
})
export class ProfileEditComponent implements OnInit {
  role = 'nothing';
  states = StatesHelper.states;
  user = new User();
  image:any;

  constructor(
    private meService: MeService,
    private router: Router,
    private httpHandlerService:HttpHandlerService,
    private imageUploadService:ImageUploadService
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
      }).catch(error => console.log(error));
    }else{
      this.meService.updateMe(this.user).then(response => {
        this.router.navigate(['/user', this.user.id]);
      }).catch(error => console.log(error));
    }
  }

  fileChange(imageField){
    //store file temporarily
    this.image = imageField.files[0];
  }
}
