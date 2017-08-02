import { Component, OnInit, ViewChild, ElementRef, Output, Input, EventEmitter } from '@angular/core';
import { CategoryService } from '../_services/category.service';


@Component({
  selector: 'category-select',
  templateUrl: './category-select.component.html',
  styleUrls: ['./category-select.component.css']
})
export class CategorySelectComponent implements OnInit {
  //categories = [];
  categoriesList = [];
  @ViewChild('category') category: ElementRef;
  @Input() categories = [];
  @Output() categoriesChange = new EventEmitter();

  constructor(
    private categoryService: CategoryService
  ){}

  ngOnInit(){
    this.getCategories();
  }

  private getCategories(){
    this.categoryService.getCategories().then(categories => this.categoriesList = categories.json().data)
      .catch(() => console.log('There was an error getting categories'));
  }

  public addCategory(value){
    let values = value.split(',');
    let category = {
      category_id:values[0],
      subcategory_id:values[1],
      subcategory_name:values[2]
    };
    if(!this.categoryExists(category)){
      this.categories.push(category);
    }
    this.category.nativeElement.value = 'null'; //set the dropdown back to the default value
    //emit the update event
    this.categoriesChange.emit(this.categories);
  }

  private categoryExists(category){
    for(let eventCategory of this.categories){
      if(category.subcategory_id == eventCategory.subcategory_id){
        return true;
      }
    }
    return false;
  }

  public removeCategory(category){
    let index = this.categories.indexOf(category);
    if(index !== -1){
      //element exists in our array
      this.categories.splice(index, 1);
    }
  }

}
