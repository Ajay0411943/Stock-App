import { Injectable } from '@nestjs/common';
import { Stock } from '../models/stock.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import StockEntity from '../../infrastructure/entities/stock.entity';
import { IStockService } from '../primary-port/stock.service.interface';

@Injectable()
export class StockService implements IStockService {
  allStocks: Stock[] = [];

  constructor(
    @InjectRepository(StockEntity)
    private stockRepository: Repository<StockEntity>,
  ) {}

  addStock(): void {
    //Made for testing alone
    const testStock: Stock = {
      id: 7,
      stockname: 'Nolan Power',
      description: 'Stolen from New Orleans',
      currentValue: 888,
      initialPrice: 444,
      initialDate: 'unimplemented',
    };
    this.stockRepository.create(testStock);
    this.stockRepository
      .save(testStock)
      .then((testStock) => {
        console.log('Stock has been found: ', testStock);
      })
      .catch((err) => {
        console.log('Error: ', err);
      })
      .finally(() => {
        console.log('Finally called');
      });
  }

  async updateStockValue(
    stockId: number,
    updatedStocksValue: string,
  ): Promise<void> {
    const stockDB = await this.stockRepository.findOne({ id: stockId });
    if (stockDB) {
      stockDB.initialPrice = parseInt(updatedStocksValue);
      await this.stockRepository.update(stockId, stockDB);
    }
  }

  async getAllStocks(): Promise<Stock[]> {
    const stocks = await this.stockRepository.find();
    console.log('Stocks = ', stocks);
    const allStocks: Stock[] = JSON.parse(JSON.stringify(stocks));
    console.log('getAllStocks total: ', allStocks.length);
    return allStocks;
  }
  async createStock(stock: Stock): Promise<Stock> {
    try {
      const stockCreated = await this.stockRepository.create({
        stockname: stock.stockname,
        description: stock.description,
        currentValue: stock.currentValue,
        initialDate: stock.initialDate,
        initialPrice: stock.initialPrice,
      });
      await this.stockRepository.save(stockCreated);
      return stockCreated;
    } catch (e) {
      console.log('Catch an error', e);
    }
  }
}
