import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { HttpHandlerService } from './http-handler.service';
import { Observable }        from 'rxjs/Observable';
import { DOCUMENT } from '@angular/platform-browser';
import 'rxjs/add/operator/toPromise';

/*
  IMAGE SIZES FOR VENUES, USERS, PAGES, SHOWS
  image_sm 200x200
  image_lg 800x800

  IMAGE SIZES FOR EVENTS AND MVE
  image_sm 200x259
  image_lg 800x1037
*/


@Injectable()

export class ImageUploadService {
  constructor(
    private http: Http,
    private httpHandlerService: HttpHandlerService,
    @Inject(DOCUMENT) private document: Document
  ){}

  public uploadImageToS3(file, item, itemId, folder){
    return new Promise((resolve, reject) => {
      let validItems = {
        'event':{
          folders:{
            //other image sizes to be saved with original (eg. originalname_sm.jpg)
            main:[{width:200,height:259,ext:'sm'}, {width:800,height:1037,ext:'lg'}]
          }
        },
        'mve':{
          folders:{
            main:[{width:200,height:200,ext:'sm'}, {width:800,height:800,ext:'lg'}]
          }
        },
        'page':{
          folders:{
            main:[{width:200,height:200,ext:'sm'}, {width:800,height:800,ext:'lg'}]
          }
        },
        'show':{
          folders:{
            main:[{width:200,height:200,ext:'sm'}, {width:800,height:800,ext:'lg'}]
          }
        },
        'venue':{
          folders:{
            main:[{width:200,height:200,ext:'sm'}, {width:800,height:800,ext:'lg'}]
          }
        },
        'user':{
          folders:{
            main:[{width:200,height:200,ext:'sm'}, {width:800,height:800,ext:'lg'}]
          }
        }
      }

      //check if item is valid
      if(!validItems[item]){
        return false;
      }
      //check if item's folder is valid
      if(!(folder in validItems[item].folders)){
        return false;
      }
      
      let sizes = validItems[item]['folders'][folder]; //ex [200x200,700x700]
      let numSizes = validItems[item]['folders'][folder].length; //number of extra sizes to upload
      
      let timestamp = new Date().getTime(); //will become new name of file
      let extension = file.name.split('.').pop();
      let originalFilePath:string;

      this.getCredentials(item, itemId, folder, timestamp, extension).then((s3Credentials:any) => {
        //return this.getCredentials();
        let url = s3Credentials.url;
        delete s3Credentials.url; //remove it from regular credentials
        this.s3SaveImage(s3Credentials, url, file).then((filePath:string) => {
          originalFilePath = filePath;
          let i = 0;
          for(let size of sizes){
            let width = +size.width;
            let height = +size.height;
            let filename = `${timestamp}_${size.ext}`;
            let url = '';
            let newS3Credentials:any;

            this.getCredentials(item, itemId, folder, filename, 'jpg').then((s3Credentials:any) => {
              url = s3Credentials.url;
              delete s3Credentials.url; //remove it from regular credentials
              newS3Credentials = s3Credentials;
              return this.processImage(file, width, height);
            }).then(image => {
              return this.s3SaveImage(newS3Credentials, url, image);
            }).then(response => {
              i++;
              if(i == numSizes){
                //return the original file name
                resolve(originalFilePath);
              }
            }).catch(error => reject(error));
          }  
        }).catch(error => reject(error));
      });
    });
  }
  
  private processImage(file, width, height):Promise<any> {
    return new Promise((resolve, reject) => {
      // Create the file reader  
      let reader = new FileReader();  
      // Start reading this file  
      this.readFile(file, reader, (result) => {
        // Create an img element and add the image file data to it  
        var img = this.document.createElement("img");
        img.src = result;  
        // Send this img to the resize function (and wait for callback)  
        this.resize(img, width, height, (resizedJpeg, before, after) => {
            // For debugging (size in bytes before and after)  
            //this.debug_size_before.push(before);  
            //this.debug_size_after.push(after);  
            // Add the resized jpeg img source to a list for preview  
            // This is also the file you want to upload. (either as a  
            // base64 string or img.src = resized_jpeg if you prefer a file).  
            resolve(resizedJpeg);
        });  
      });  
    });
  }

  private readFile(file, reader, callback) {
    //send reader result to callback
    reader.onload = () => {  
        callback(reader.result);  
    }
    //start reading the file 
    //not sure why this is listed after the onload but documentation does it this way
    reader.readAsDataURL(file);
  }

  private resize(img, canvasWidth: number, canvasHeight: number, callback) {
    // This will wait until the img is loaded before calling this function
    return img.onload = () => {
      // create a canvas object  
      var canvas = this.document.createElement("canvas");  
      // Set the canvas to the new calculated dimensions  
      canvas.width = canvasWidth;  
      canvas.height = canvasHeight;
      let imageWidth = img.width;
      let imageHeight = img.height;

      var ctx = canvas.getContext("2d");
      this.scale(canvasWidth, canvasHeight, imageWidth, imageHeight, (newWidth, newHeight) => {
        let xStart = 0;
        let yStart = 0;
        if(newHeight < newWidth) {
            xStart = (canvasWidth - newWidth) / 2;
        } else {
            yStart = (canvasHeight - newHeight) / 2;
        }
        ctx.drawImage(img, xStart, yStart, newWidth, newHeight);
        
        canvas.toBlob((image) => {
          callback(image);
        },'image/jpeg', 1);
      });

      /*
      //ctx.drawImage(img, 0, 0, width, height);  
      // Get this encoded as a jpeg  
      // IMPORTANT: 'jpeg' NOT 'jpg'  
      let dataUrl = canvas.toDataURL('image/jpeg', 1);
      callback(dataUrl);
      */
    }; 
  }

  private scale(canvasWidth:number, canvasHeight:number, imageWidth:number, imageHeight:number, callback){
    let aspectRatio = imageWidth/imageHeight;
    let newWidth;
    let newHeight;
    if(imageWidth < imageHeight){
      newHeight = canvasWidth/aspectRatio;
      newWidth = canvasWidth;
      if(newHeight < canvasHeight){
        newWidth = canvasHeight * aspectRatio;
        newHeight = canvasHeight;
      }
    }	else {
      newWidth = aspectRatio * canvasHeight;
      newHeight = canvasHeight;
      if(newWidth < canvasWidth){
        newHeight = canvasWidth/aspectRatio;
        newWidth = canvasWidth;
      }
    }
    callback(newWidth, newHeight);
  }


  private getS3Key(item, itemId, folder):Promise<any>{
    let path = `signupload/${item}/${itemId}/${folder}`;
    return this.httpHandlerService.get(path)
      .map(response => response.json())
      .toPromise();
  }

  private getCredentials(item, itemId, folder, filename, extension='jpg'){
    return new Promise((resolve, reject) => {
        this.getS3Key(item, itemId, folder).then(response => {
          let s3Credentials = response.additionalData;
          s3Credentials.key = `${item}/${itemId}/main/${filename}.${extension}`;
          s3Credentials.url = response.attributes.action;
          resolve(s3Credentials);
        }).catch(error => reject('S3 Credentials unavailable'));
    });
  }

  private s3SaveImage(s3Credentials, url, file){
    return new Promise((resolve, reject) => {
      let body = new FormData();
      for(let key in s3Credentials){
        body.append(key,s3Credentials[key]);
      }
      //let image = this.dataURItoBlob(file, 'image/jpeg');
      let image = file;
      body.append('file', image);
      this.http.post(url, body).map(response => {
        //return the url to the file on s3
        if(response.status === 204){
          resolve(`${url}/${s3Credentials.key}`);
        }else{
          reject('S3 image save failed');
        }
      }).subscribe();
    });
  }
}