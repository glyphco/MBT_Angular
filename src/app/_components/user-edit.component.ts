import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';
import { User } from '../_models/user';
import { UserService } from '../_services/user.service';
import { MeService } from '../_services/me.service';
import { ImageUploadService } from '../_services/image-upload.service';
import { DateTime } from '../_helpers/date-time.service';
import { StatesHelper } from '../_helpers/states-helper';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./backstage.component.css']
})
export class UserEditComponent implements OnInit, OnDestroy {
  user = new User;
  private sub: any;
  bannedUntil = new DateTime();
  states = StatesHelper.states;
  image:any;
  previewImage:any;

  constructor(
    private userService:UserService,
    private route: ActivatedRoute,
    private location: Location,
    private meService: MeService,
    private imageUploadService: ImageUploadService,
    private router: Router
  ){}

  ngOnInit():void{
    this.sub = this.route.params.subscribe(params => {
       let id = +params['id']; // (+) converts string 'id' to a number
       this.getUserEdit(id);
    });
    console.log(this.bannedUntil.date);
  }

  ngOnDestroy():void {
    this.sub.unsubscribe();
  }

  public getUserEdit(id:number){
    this.userService.getUserEdit(id).then(user => {
      this.user = User.map(user.json().data);
    }).catch(error => console.log(error));
  }

  public onSubmit(){
    this.uploadImageIfExist().then((imageUrl:string) => {
      if(imageUrl){
        this.user.imageUrl = imageUrl;
      }
      //this.user.bannedUntil = this.bannedUntil; 

      return this.userService.updateUser(this.user)
    }).then(response => {
      this.router.navigate(['/users/editable']);
    }).catch(error => console.log(error));
  }

  private uploadImageIfExist():Promise<any>{
    if(this.image){
      return this.imageUploadService.uploadImageToS3(this.image, 'user', this.user.id, 'main');
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

  public saveRole(){

        // Route::get('/user/{id}/makesuperadmin', 'UserController@makesuperadmin');
        // Route::get('/user/{id}/makeadmin', 'UserController@makeadmin');
        // Route::get('/user/{id}/makemastereditor', 'UserController@makemastereditor');
        // Route::get('/user/{id}/makecontributor', 'UserController@makecontributor');
        // Route::get('/user/{id}/makenothing', 'UserController@makenothing');
        

    // this.httpHandlerService.get(`me/makeme/${this.role}`)
    //   .map(response => response.json())
    //   .toPromise()
    //   .then(response => this.announcementService.openToasterSuccess(response.data))
    //   .catch(error => this.announcementService.openToasterError('Role change failed'))
  }
  
}
