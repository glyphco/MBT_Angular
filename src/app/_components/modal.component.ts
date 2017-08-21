import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'modal',
  template: `
    <div [class.global-modal-show]="show" class="global-modal">
      <div class="overlay"></div>
      <div class="global-modal_contents modal-transition">
        <div class="global-modal-header">
          <span class="mobile-close" (click)="closeModal()"><i class="fa fa-times" aria-hidden="true"></i></span>
          <ng-content select=".modal-title"></ng-content>
        </div>
        <div class="global-modal-body">
          <ng-content select=".modal-body"></ng-content>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./modalv2.component.css']
})
export class ModalComponent {
  public show = false;
  @Input() set modalVisible(value){
    this.show = value;
  };
  @Output() modalVisibleChange = new EventEmitter();

  public closeModal(){
    this.modalVisible = false;
    this.modalVisibleChange.emit(false);
  }
}
