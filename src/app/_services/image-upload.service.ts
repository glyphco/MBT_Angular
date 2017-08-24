import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { HttpHandlerService } from './http-handler.service';
import { Observable }        from 'rxjs/Observable';
import { DOCUMENT } from '@angular/platform-browser';
import 'rxjs/add/operator/toPromise';



@Injectable()

export class ImageUploadService {
  constructor(
    private http: Http,
    private httpHandlerService: HttpHandlerService,
    @Inject(DOCUMENT) private document: Document
  ){}

  public uploadImageToS3(file, item, itemId, folder, width=200, height=200){
    return new Promise((resolve, reject) => {
      let validItems = {
        'event':{canUse:['main']},
        'mve':{canUse:['main']},
        'page':{canUse:['main']},
        'show':{canUse:['main']},
        'venue':{canUse:['main']},
        'user':{canUse:['main']}
      }

      //check if item is valid
      if(!validItems[item]){
        return false;
      }
      //check if item's folder is valid
      if(validItems[item].canUse.indexOf(folder) < 0){
        return false;
      }
      
      console.log('passed validation');
      this.processImage(file, width, height).then(image => {
        this.getCredentials(item, itemId, folder).then((s3Credentials:any) => {
          //return this.getCredentials();
          let url = s3Credentials.url;
          delete s3Credentials.url; //remove it from regular credentials
          return this.s3SaveImage(s3Credentials, url, image);
        }).then(response => resolve(response)).catch(error => reject(error));
      });
    });
  }
  
  private processImage(file, width, height, index = 0):Promise<any> {
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

  /*------------------------------------------------------
  FOR UPLOADING MULTIPLE FILES
  -------------------------------------------------------*/
  /*
  private readFiles(files, width, height, index = 0):Promise<any> {
    return new Promise((resolve, reject) => {
      // Create the file reader  
      let reader = new FileReader();  
      // If there is a file  
      if (index in files) {
        // Start reading this file  
        this.readFile(files[index], reader, (result) => {
            // Create an img element and add the image file data to it  
            var img = this.document.createElement("img");
            img.src = result;  
            // Send this img to the resize function (and wait for callback)  
            this.resize(img, width, height, (resized_jpeg, before, after) => {  
                // For debugging (size in bytes before and after)  
                //this.debug_size_before.push(before);  
                //this.debug_size_after.push(after);  
                // Add the resized jpeg img source to a list for preview  
                // This is also the file you want to upload. (either as a  
                // base64 string or img.src = resized_jpeg if you prefer a file).  

                var resizedImg = this.document.createElement("img");
                resizedImg.src = resized_jpeg;

                // Read the next file;
                //this.readFiles(files, index + 1);
                resolve(resizedImg.src);
                //this.uploadImageS3(resizedImg.src);
            });  
        });  
      }
    });
  }*/

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
        /*
        let dataUrl = canvas.toDataURL('image/jpeg', 1);
        callback(dataUrl);*/
        
        canvas.toBlob((image) => {
          callback(image);
        },'image/jpeg', 1);
      });
    /*
      
      //ctx.drawImage(img, 0, 0, width, height);  
      // Get this encoded as a jpeg  
      // IMPORTANT: 'jpeg' NOT 'jpg'  
      canvas.toBlob((image) => {
        callback(image);
      },'image/jpeg', 1);*/
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

  private resizeOriginal(img, MAX_WIDTH: number, MAX_HEIGHT: number, callback) {  
    // This will wait until the img is loaded before calling this function
    return img.onload = () => {
      // Get the images current width and height  
      var width = img.width;  
      var height = img.height;  
      // Set the WxH to fit the Max values (but maintain proportions)
      if (width > height) {  
          if (width > MAX_WIDTH) {  
              height *= MAX_WIDTH / width;  
              width = MAX_WIDTH;  
          }  
      } else {  
          if (height > MAX_HEIGHT) {  
              width *= MAX_HEIGHT / height;  
              height = MAX_HEIGHT;  
          }  
      }
      // create a canvas object  
      var canvas = this.document.createElement("canvas");  
      // Set the canvas to the new calculated dimensions  
      canvas.width = width;  
      canvas.height = height;  
      var ctx = canvas.getContext("2d");  
      ctx.drawImage(img, 0, 0, width, height);  
      // Get this encoded as a jpeg  
      // IMPORTANT: 'jpeg' NOT 'jpg'  
      canvas.toBlob((image) => {
        callback(image);
      },'image/jpeg', 1);
    }; 
  }

  private getS3Key(item, itemId, folder):Promise<any>{
    let path = `signupload/${item}/${itemId}/${folder}`;
    return this.httpHandlerService.get(path)
      .map(response => response.json())
      .toPromise();
  }

  private getCredentials(item, itemId, folder){
    return new Promise((resolve, reject) => {
        this.getS3Key(item, itemId, folder).then(response => {
          let timestamp = new Date().getTime();
          let s3Credentials = response.additionalData;
          s3Credentials.key = `${item}/${itemId}/main/${timestamp}.jpg`;
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