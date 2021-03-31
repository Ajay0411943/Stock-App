import { Module } from '@nestjs/common';
import { StockGateway } from './gateway/stock.gateway';
import { StockService } from '../core/service/stock.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import StockEntity from '../infrastructure/entities/stock.entity';
import { IStockServiceProvider } from '../core/primary-port/stock.service.interface';

@Module({
  imports: [TypeOrmModule.forFeature([StockEntity])],
  providers: [
    StockGateway,
    {
      provide: IStockServiceProvider,
      useClass: StockService,
    },
  ],
})
export class StockModule {}
