export class Pagination {
  totalObjects = 0;
  currentPage = 1;
  perPage = 0;
  totalPages = 0;
  pageList: number[];

  public setPage(page:number, perPage:number, totalObjects:number):void{
      this.currentPage = page;
      this.perPage = perPage;
      this.totalObjects = totalObjects;
      this.totalPages = Math.ceil(totalObjects / perPage);
      this.setPageList();
  }

  public setPageList():void{
    if(this.currentPage <= 5){
      let end = this.totalPages < 10 ? this.totalPages : 10; 
      this.pageList = this.numberArrayFill(1, end);
    }else if(this.currentPage > 5){
      let start = this.currentPage - 4;
      let end = (this.currentPage + 5) < this.totalPages ? (this.currentPage + 5) : this.totalPages;
      this.pageList = this.numberArrayFill(start, end);
    }
  }

  private numberArrayFill(start, end):number[]{
    let list = []
    for (var i = start; i <= end; i++) {
      list.push(i);
    }
    return list;
  }
}