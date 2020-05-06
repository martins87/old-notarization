import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Transaction } from './transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  transactions: Transaction[];
  // readonly baseURL = 'http://localhost:3000/transactions';
  readonly baseURL = 'https://notarization-backend.herokuapp.com/transactions';

  constructor(private http: HttpClient) { }

  getTransactionList(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.baseURL);
  }

  addTransaction(transaction: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(this.baseURL, transaction);
  }

  deleteTransaction(id: string): Observable<Transaction> {
    if (confirm('Are you sure?')) {
      console.log('idToDelete: ', id);
      return this.http.delete<Transaction>(this.baseURL + `/${id}`);
    }
  }

  isDataRegistered(data: string): Observable<string[]> {
    return this.http.get<string[]>(this.baseURL + `/check/${data}`, {
      params: { dataToCheck: data }
    });
  }

}
