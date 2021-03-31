import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Inject } from '@nestjs/common';
import {
  IStockService,
  IStockServiceProvider,
} from '../../core/primary-port/stock.service.interface';

import { Stock } from '../../core/models/stock.model';
import { UpdateStocksDTO } from '../dto/update.stocks';

@WebSocketGateway()
export class StockGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject(IStockServiceProvider)
    private stockService: IStockService,
  ) {}

  @WebSocketServer() server;
  @SubscribeMessage('update')
  async handleStockUpdateEvent(
    @MessageBody() stockUpdate: UpdateStocksDTO,
  ): Promise<void> {
    console.log('Gateway = ', stockUpdate.id, stockUpdate.updatedStocksValue);
    await this.stockService.updateStockValue(
      stockUpdate.id,
      stockUpdate.updatedStocksValue,
    );
    this.server.emit('update', this.stockService.getAllStocks());
  }

  @SubscribeMessage('create-stock')
  async handleMessage(
    @MessageBody() data: Stock,
    @ConnectedSocket() client: Socket,
  ) {
    const stock: Stock = {
      id: data.id,
      stockname: data.stockname,
      description: data.description,
      currentValue: data.currentValue,
      initialPrice: data.initialPrice,
      initialDate: data.initialDate,
    };
    try {
      const stockCreated = await this.stockService.createStock(stock);
      client.emit('stock-created-success', stockCreated);
    } catch (e) {
      client.emit('stock-created-error', e.message);
    }
  }

  async handleConnection(client: Socket, ...args: any[]): Promise<any> {
    console.log('Client Connect', client.id);
    client.emit('allStocks', await this.stockService.getAllStocks()); //
  }

  async handleDisconnect(client: Socket, ...args: any): Promise<any> {
    console.log('Client Disconnect', client.id);
    client.emit('allStocks', await this.stockService.getAllStocks()); //
  }
}
