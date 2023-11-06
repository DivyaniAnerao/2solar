/*
Description: This file defins the service functions for orders
Auther: Divyani Anerao
*/
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Orders} from '../../../typeorm/orders.entity';
import {OrderDto} from '../../dto/order.dto';

@Injectable()
export class OrdersService { /* All the required repositories and services are injected in the constructor
*/
    constructor(@InjectRepository(Orders)private orderRepository : Repository < Orders >) {}

    /*
    This function adds new record to orders table for the order
    */
    async addNewOrder(productId : number, quantity : number, buyerName : string, buyerPhoneNumber : number): Promise < number > { // Prepare the order object
        let orderDto: OrderDto = {
            productId,
            quantity,
            buyerName,
            buyerPhoneNumber,
            orderedAt: new Date()
        }
        // Save the order to database
        const result: OrderDto = await this.orderRepository.save(orderDto);
        // Return 1 on success and 0 on failure
        return result == orderDto ? 1 : 0
    }
}
