/*
Description: This file contains all important imports of product
Auther: Divyani Anerao
*/

import { Module } from '@nestjs/common';
import { ProductsController } from './controllers/products/products.controller';
import { ProductsService } from './service/products/products.service';
import { OrdersService } from '../orders/service/orders/orders.service';
import { Products } from '../typeorm/products.entity';
import { Orders } from '../typeorm/orders.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
@Module({
  imports: [TypeOrmModule.forFeature([Products,Orders])],
  controllers: [ProductsController],
  providers: [ProductsService,OrdersService,ConfigService]
})
export class ProductsModule {}
