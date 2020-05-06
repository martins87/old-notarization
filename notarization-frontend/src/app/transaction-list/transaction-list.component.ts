import { Component, OnInit, Input } from '@angular/core';
import { Transaction } from '../shared/transaction.model';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent implements OnInit {

  @Input() transactionList: Transaction[];

  constructor() { }

  ngOnInit(): void {
    // $(document).ready(function() {
    //   $('.collapsible').collapsible({});
    // });
  }

}
