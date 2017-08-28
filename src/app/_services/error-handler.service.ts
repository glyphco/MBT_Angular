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
      duration: 3000
    });
  };
}