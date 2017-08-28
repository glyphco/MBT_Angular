import { Injectable } from '@angular/core';
import { MdSnackBar } from '@angular/material';


@Injectable()

export class ErrorHandlerService {
  constructor(
    private snackBar: MdSnackBar 
  ){}

  openToasterError(message, duration=3000){
    this.snackBar.open(message, null, {
      extraClasses: ['toaster-danger'],
      duration: duration
    });
  };

  openToasterApiError(error, duration=3000){
    let title = error.json().message;
    let description = error.json().data;
    let message = `${title}: ${description}`;
    this.openToasterError(message, duration);
  };
}