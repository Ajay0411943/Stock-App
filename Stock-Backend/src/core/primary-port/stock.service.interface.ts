import { Stock } from '../models/stock.model';

export const IStockServiceProvider = 'IStockServiceProvider';
export interface IStockService {
  updateStockValue(stockId: number, updatedStockValue: string): Promise<void>;

  getAllStocks(): Promise<Stock[]>;
  createStock(stock: Stock): Promise<Stock>;
}
