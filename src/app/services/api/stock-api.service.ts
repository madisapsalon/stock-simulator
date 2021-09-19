import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StockApi } from '../stocks/models/stock.api';

@Injectable()
export class StockApiService {

  constructor(private http: HttpClient) { }

  fetchStocks(): Observable<StockApi[]> {
    const url = 'stocks.php';
    return this.http.get<StockApi[]>(url);
  }
}
