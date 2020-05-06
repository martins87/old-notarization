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
  txHash: string;
  transactionOnTheWay: boolean;
  existingTxs: boolean;
  txs: string[];

  textMode: boolean;
  fileMode: boolean;
  listMode: boolean;
  dataCheck: boolean;
  fileCheck: boolean;
  data: string;
  dataDigest: string;
  fileDigest: string;
  fileName: string;
  file: File;

  constructor(private transactionService: TransactionService) { }

  ngOnInit(): void {
    this.refreshTransactionList();
    this.data = '';
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
        console.log('(Angular) Data already registered:', txArray);
        this.dataCheck = mode === 'text' ? true : false;
        this.fileCheck = mode === 'file' ? true : false;
        this.existingTxs = true;
        this.txs = txArray;
      } else {
        this.dataCheck = false;
        this.fileCheck = false;

        let transaction = new Transaction();
        if (mode === 'text') {
          if (this.data.length > 66) {
            transaction.data = this.data.substring(0, 66) + '...';
          } else {
            transaction.data = this.data;
          }
        } else if (mode === 'file') {
          transaction.data = this.fileName;
        }
        transaction.digest = digestToRegister;
        transaction.timestamp = String(Date.now());
        transaction.tx = '';
        console.log('(Angular) New transaction:', transaction);

        this.transactionOnTheWay = true;
        form.reset();

        this.transactionService.addTransaction(transaction).subscribe((res) => {
          // TODO: tratar erro ao registrar
          console.log('(Angular) Transaction added to Ethereum Blockchain:', res);
          this.transactionOnTheWay = false;
          this.txHash = res.tx;
        }, err => {
          console.error('(Angular) Error on adding transaction:', err)
        });

        this.existingTxs = false;
      }
    });
  }

  // onDelete() {
  //   this.transactionService.deleteTransaction(this.transaction._id).subscribe((res) => {
  //     console.log('Return of delete request:', res);
  //   });
  // }

  onReset(transactionForm: NgForm, mode: string) {
    if (mode === 'text') {
      this.data = '';
    } else if (mode === 'file') {
      this.file = null;
      this.fileName = '';
      this.fileDigest = '';
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
    if (this.data) {
      this.dataDigest = sha256(this.data);
    }
  }

}
