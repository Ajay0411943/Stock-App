import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';

import { Subject, Subscription} from 'rxjs';
import {take, takeUntil} from 'rxjs/operators';
import {StockService} from './shared/stock.service';
import {StockDTO} from './shared/StockDTO';
import {Stock} from './shared/stock.model';


@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit, OnDestroy {
  stockFC = new FormControl('');
  public stock!: StockDTO;
  allStocks: StockDTO[] = [];
  unsubscribe$ = new Subject();
  stockSelected!: Stock; // NEW
  // NEW
  // NEW
  updatedStock!: StockDTO;

  allStocks$: Subscription | undefined;

  constructor(private stockService: StockService) {}

  ngOnInit(): void {
    this.allStocks$ = this.stockService.listenForStockUpdates()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(newStockValue => {
        console.log('listening for backend stocks');
        this.allStocks.push(newStockValue);
      });

    this.stockService.getAllStocks()
      .pipe(
        take(1)
      )
      .subscribe(stocks => {
        this.allStocks = stocks;
        console.log('allStocks Frontend =', stocks);
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  increaseValue(): void {
    this.changeStockValue(1);
    console.log('up', this.stockFC.value);
  }

  decreaseValue(): void  {
    this.changeStockValue(-1);
    console.log('down', this.stockFC.value);
  }

  changeStockValue(increment): void {
    if (this.updatedStock) {
      this.updatedStock.initialPrice += increment;
      this.stockFC.patchValue(this.updatedStock.initialPrice);
    } else {
      console.log('error - no stock selected to change value of');
    }
  }

  updateStock(): void  {
    console.log('update', this.stockFC.value);
    this.stockService.updateStock(this.updatedStock.id, this.stockFC.value);
    this.stockFC.patchValue(this.updatedStock.initialPrice);
    location.reload();
  }


  onSelection(e, v): any {
    console.log(this.stockSelected = e.option.value);
    this.stockSelected = e.option.value;
  }

  onNgModelChange($event: any): void {
    const stockName = this.stockSelected[0].toString();
    this.updatedStock = this.allStocks.find(us => us.stockname === stockName);
    if (this.updatedStock)
    {
      console.log(this.updatedStock.stockname, this.updatedStock.description);
      this.stockFC.patchValue(this.updatedStock.initialPrice);
    } else {
      console.log('error - no stock with that name found');
    }
  }
}
