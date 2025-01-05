import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { log } from 'console';

@Injectable({
  providedIn: 'root',
})
export class SimulationService {

    private productTypeUrl = 'http://ec2-54-89-164-48.compute-1.amazonaws.com/product/product-type-list';
    private assignmentTypeUrl = 'http://ec2-54-89-164-48.compute-1.amazonaws.com/assignment-type/assignment-type-list';
    private investorUrl = 'http://ec2-54-89-164-48.compute-1.amazonaws.com/investor/investor-list/{productId}/{assignmentTypeId}';
    
    

    constructor(
        private http: HttpClient,
    ) { }

    getProductList(): Observable<any[]> {
        return this.http.get<any[]>(this.productTypeUrl)
        .pipe(
            catchError(this.handleError<any[]>('getProductList', []))
          );
    }

    getAssignmentTypeList(): Observable<any[]> {
        return this.http.get<any[]>(this.assignmentTypeUrl)
        .pipe(
            catchError(this.handleError<any[]>('getAssignmentTypeList', []))
          );
    }

    getInvestorList(productId: string, assignmentTypeId: string): Observable<any[]> {
      
      const url = this.investorUrl.replace('{productId}', productId).replace('{assignmentTypeId}', assignmentTypeId);
      
      return this.http.get<any[]>(url)
        .pipe(
            catchError(this.handleError<any[]>('getInvestorList', []))
          );
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
          console.error(error); // log to console instead
      
          return of(result as T);
        };
      }

}
