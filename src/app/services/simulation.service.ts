import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { log } from 'console';

@Injectable({
  providedIn: 'root',
})
export class SimulationService {

    //private rootPath = 'https://c9nkmwnh0e.execute-api.us-east-1.amazonaws.com/backend/'
    private rootPath = 'http://localhost:8080/'

    private productTypeUrl = this.rootPath + 'product/product-type-list';
    private assignmentTypeUrl = this.rootPath + 'assignment-type/assignment-type-list';
    private investorUrl = this.rootPath + 'investor/investor-list/{productId}/{assignmentTypeId}';
    private predictUrl = this.rootPath + 'predict';
    
    

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

      predict(dataForm: any): Observable<any> {
        
        return this.http.post<any>(this.predictUrl, dataForm)
          .pipe(
              catchError(this.handleError<any[]>('Predict', []))
            );
      }

}
