import { Component, OnInit } from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {StockService} from '../shared/stock.service';
import {Stock} from '../shared/stock.model';

@Component({
  selector: 'app-stock-create',
  templateUrl: './stock-create.component.html',
  styleUrls: ['./stock-create.component.scss']
})
export class StockCreateComponent implements OnInit {
  stockForm = this.fb.group({
    stockname: [''],
    description: [''],
    currentValue: [''],
    initialDate: [''],
    initialPrice: ['']
  });
  stockCreate: Stock | undefined;
  error: string | undefined;
  constructor(private fb: FormBuilder, private stockService: StockService) { }

  ngOnInit(): void {
  }

  createStock(): void{
    this.error = undefined;
    const stockDto: Stock = this.stockForm.value;
    this.stockService.createStock(stockDto);
  }
}
