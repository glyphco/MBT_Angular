import { Component, OnInit } from '@angular/core';
import { SearchService } from '../_services/search.service';
import { Observable }        from 'rxjs/Observable';
import { Subject }           from 'rxjs/Subject';
// Observable class extensions
import 'rxjs/add/observable/of';
// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  //styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  private searchTerms = new Subject<string>();
  results: Observable<any[]>;
  constructor(private searchService: SearchService){}

  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit():void{
    this.results = this.searchTerms
      .debounceTime(300)        // wait 300ms after each keystroke before considering the term
      .distinctUntilChanged()   // ignore if next search term is same as previous
      .switchMap(term => term   // switch to new observable each time the term changes
        // return the http search observable
        ? this.searchService.search(term)
        // or the observable of empty heroes if there was no search term
        : Observable.of<any[]>([]))
      .catch(error => {
        // TODO: add real error handling
        return Observable.of<any[]>([]);
      });
  }


}
