import {Injectable} from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {Observable} from 'rxjs';
import {StockDTO} from './StockDTO';
import {UpdateStocksDTO} from './update.stock.dto';
import {Stock} from './stock.model';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor(private socket: Socket) { }
  updateStock(stockId: number, updatedStock: string): void { // NEW
    const stockUpdateDto: UpdateStocksDTO = {
      id: stockId,
      updatedStocksValue: updatedStock
    };
    console.log('DTO = ', stockUpdateDto.id, stockUpdateDto.updatedStocksValue);

    this.socket.emit('update', stockUpdateDto);
  }
  createStock(stock: Stock): void{
    this.socket.emit('create-stock', stock);
  }

  listenForStockUpdates(): Observable<StockDTO> {
    console.log('Stock updated in service');

    const ss = this.socket
      .fromEvent<StockDTO>('allStocks'); // ??  gets the current stock value (of selected company)
    if (!ss) {
      console.log('Ss = undefined');
    } else {
      console.log('Ss = DEFINED', ss);
    }
    return ss;
  }

  getAllStocks(): Observable<StockDTO[]> {
    const staks =  this.socket
      .fromEvent<StockDTO[]>('allStocks');
    return staks;
  }

  connect(): void {
    this.socket.connect();
  }

  disconnect(): void {
    this.socket.disconnect();
  }
}
