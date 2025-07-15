import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoaddataService {
  constructor() { }

  getGridData(qry: any): Observable<any> {
    debugger
    var dataset: any[] = [];
    var objQry = JSON.parse(qry ?? '');
    var pageSize: number = +objQry?.pageNumber || 0;
    var pageEnd: number = +objQry?.pageSize || 5;
    pageEnd += pageSize;
    for (let i = pageSize; i < pageEnd; i++) {
      dataset.push({
        id: i,
        title: 'Task obs ' + i,
        title1: 'Task1-' + i,
      });
    }
    return of(dataset);
  }
}
