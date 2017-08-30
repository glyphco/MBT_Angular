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
            main:[
              {width:200,height:259,ext:'sm'}, 
              {width:500,height:648,ext:'lg'},
              {width:50,height:65,ext:'icon'}
            ]
          }
        },
        'mve':{
          folders:{
            main:[
              {width:200,height:200,ext:'sm'}, 
              {width:500,height:500,ext:'lg'},
              {width:50,height:50,ext:'icon'}
            ]
          }
        },
        'page':{
          folders:{
            main:[
              {width:200,height:200,ext:'sm'}, 
              {width:500,height:500,ext:'lg'},
              {width:50,height:50,ext:'icon'}
            ]
          }
        },
        'show':{
          folders:{
            main:[
              {width:200,height:200,ext:'sm'}, 
              {width:500,height:500,ext:'lg'},
              {width:50,height:50,ext:'icon'}
            ]
          }
        },
        'venue':{
          folders:{
            main:[
              {width:200,height:200,ext:'sm'}, 
              {width:500,height:500,ext:'lg'},
              {width:50,height:50,ext:'icon'}
            ]
          }
        },
        'user':{
          folders:{
            main:[
              {width:200,height:200,ext:'sm'}, 
              {width:500,height:500,ext:'lg'},
              {width:50,height:50,ext:'icon'}
            ]
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
      let s3Credentials = <any>{};
      let url:string; //base path

      this.getS3Key(item, itemId, folder).then((response:any) => {
        s3Credentials = response.additionalData;
        delete s3Credentials.key; //remove it from regular credentials
        url = response.attributes.action;
        let key = `${item}/${itemId}/main/${timestamp}.${extension}`;

        //save original image
        this.s3SaveImage(s3Credentials, url, key, file).then((filePath:string) => {
          originalFilePath = filePath;
          //save additional image sizes
          let i = 0;
          for(let size of sizes){
            let width = +size.width;
            let height = +size.height;
            let filename = `${timestamp}_${size.ext}`;

            this.processImage(file, width, height, filename).then(results => {
              let key = `${item}/${itemId}/${folder}/${results.filename}.jpg`;
              return this.s3SaveImage(s3Credentials, url, key, results.image);
            }).then(response => {
              i++;
              if(i == numSizes){
                //return the original file name
                resolve(originalFilePath);
              }
            }).catch(error => reject(error));
          }  
        }).catch(error => reject(error));
      }).catch(error => reject(error));
    });
  }

  public readUrl(file, callback) {
    var reader = new FileReader();

    reader.onload = () => {  
      callback(reader.result);  
    }
    
    reader.readAsDataURL(file);
  }
  
  private processImage(file, width, height, filename):Promise<any> {
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
            let response = {
              image: resizedJpeg,
              filename: filename //return the filename that was passed in (fixes asyc problem with loop)
            }
            resolve(response);
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
        
        if(canvas.toBlob){ //toBlob() is supported
          canvas.toBlob((image) => {
            callback(image);
          },'image/jpeg', 1);
        } else {
          let dataUri = canvas.toDataURL('image/jpeg', 1);
          callback(this.dataURItoBlob(dataUri, 'image/jpeg'));
        }
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

  private s3SaveImage(s3Credentials, url, bucket, file){
    return new Promise((resolve, reject) => {
      let body = new FormData();
      body.append('key', bucket);
      for(let key in s3Credentials){
        body.append(key,s3Credentials[key]);
      }
      //let image = this.dataURItoBlob(file, 'image/jpeg');
      let image = file;
      body.append('file', image);
      this.http.post(url, body).map(response => {
        //return the url to the file on s3
        if(response.status === 204){
          resolve(`${url}/${bucket}`);
        }else{
          reject('S3 image save failed');
        }
      }).subscribe();
    });
  }

  //IMAGE URI TO BLOB FOR SAFARI
  private dataURItoBlob(dataURI, type) {
    // convert base64 to raw binary data held in a string
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    var bb = new Blob([ab], { type: type });
    return bb;
}
}