import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as sha256 from 'sha256';
import * as CryptoJS from 'crypto-js';

import { TransactionService } from '../shared/transaction.service';
import { Transaction } from '../shared/transaction.model';
import { digest } from '@angular/compiler/src/i18n/digest';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {

  transactionList: Transaction[];
  transaction: Transaction;
  txHash: string;
  transactionOnTheWay: boolean;
  existingTxs: boolean;
  txs: string[];

  textMode: boolean;
  fileMode: boolean;
  listMode: boolean;
  dataDigest: string;
  fileDigest: string;
  fileName: string;
  file: File;

  constructor(private transactionService: TransactionService) { }

  ngOnInit(): void {
    this.refreshTransactionList();
    this.transaction = new Transaction();
    this.transaction.data = '';
    this.transactionOnTheWay = false;
    this.existingTxs = false;
    this.txs = [];
    this.dataDigest = '';
    this.fileDigest = '';
    this.fileName = '';
    this.textMode = true;
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

  onSubmit(form: NgForm, mode: string) {
    let digestToRegister = mode === 'text' ? this.dataDigest : this.fileDigest;

    this.transactionService.isDataRegistered(digestToRegister).subscribe((txArray) => {
      // always returns an array, index 0 being null or not
      if (txArray[0]) {
        console.log('Data already registered. Transactions:', txArray);
        this.existingTxs = true;
        this.txs = txArray;
      } else {
        let transaction = new Transaction();
        transaction.data = digestToRegister;
        transaction.timestamp = String(Date.now());
        transaction.tx = '';

        this.transactionOnTheWay = true;
        form.reset();

        this.transactionService.addTransaction(transaction).subscribe((res) => {
          // TODO: tratar erro ao registrar
          console.log('Transaction added:', res);
          this.transactionOnTheWay = false;
          this.txHash = res.tx;
        });

        this.existingTxs = false;
      }
    });
  }

  onDelete() {
    this.transactionService.deleteTransaction(this.transaction._id).subscribe((res) => {
      console.log('Return of delete request:', res);
    });
  }

  onReset(transactionForm: NgForm, mode: string) {
    transactionForm.reset();
    this.transaction = new Transaction();
    if (mode === 'text') {
      this.transaction.data = '';
    }
    if (mode === 'file') {
      this.fileName = '';
    }
    this.existingTxs = false;
    this.txs = [];
  }

  onFileSelected(event) {
    this.file = event.target.files[0];
    this.fileName = this.file.name;
    // console.log({'File name': this.fileName, 'File size':  this.file.size});

    var reader = new FileReader();

    reader.onload = (event) => {
      var fileResult = event.target.result;
      var fileWordArr = CryptoJS.lib.WordArray.create(fileResult);

      var digest = CryptoJS.SHA256(fileWordArr).toString();
      this.fileDigest = digest;
    };
    
    reader.readAsArrayBuffer(this.file);
  }

  onChangeMode(mode: string) {
    this.textMode = mode === 'text' ? true : false;
    this.fileMode = mode === 'file' ? true : false;
    this.listMode = mode === 'list' ? true : false;
  }

  calculateSHA256() {
    if (this.transaction.data) {
      this.dataDigest = sha256(this.transaction.data);
    }
  }

}
