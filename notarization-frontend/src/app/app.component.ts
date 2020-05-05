import { Component, OnInit } from '@angular/core';
import { TransactionService } from './shared/transaction.service';
import { Transaction } from './shared/transaction.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [TransactionService]
})
export class AppComponent implements OnInit {

  title = 'NotarizationApp';
  transactionList: Transaction[];

  constructor(private transactionService: TransactionService) { }

  ngOnInit() {
    this.refreshTransactionList();
  }

  refreshTransactionList() {
    this.transactionService.getTransactionList().subscribe((res) => {
      this.transactionList = res
        .filter(item => item.tx)
        .sort((a, b) => {
          return a.timestamp < b.timestamp ? 1 : -1;
        }) as Transaction[];
    });
  }
}
