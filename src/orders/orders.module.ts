/*
Description: This file contains all important imports of order
Auther: Divyani Anerao
*/

import { Module } from '@nestjs/common';
import { OrdersService } from '../orders/service/orders/orders.service';
import { Orders } from '../typeorm/orders.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Orders])],
  providers: [OrdersService]

})
export class OrdersModule {}
