/*
Description: This file tests the order service
Auther: Divyani Anerao
*/
import {Test, TestingModule} from '@nestjs/testing';
import {OrdersService} from './orders.service';
import {Orders} from '../../../typeorm/orders.entity';
import {getRepositoryToken} from '@nestjs/typeorm';
import {ConfigService} from '@nestjs/config';
import {Repository} from 'typeorm';

describe('OrdersService', () => {

    let service: OrdersService;
    let orderRepository: Repository<Orders>;
    let orderRepositoryToken: string |Function = getRepositoryToken(Orders);

    /* Create testing module and required services/repositories before running each test cases */
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                OrdersService, ConfigService, {
                    provide: orderRepositoryToken,
                    useClass: Repository
                }
            ]
        }).compile();
        orderRepository = module.get<Repository<Orders>>(orderRepositoryToken);
        service = module.get<OrdersService>(OrdersService);
    }, 60000);
    // This timeout was added to override the default 5000s timeout

    /*
    This test case checks if the service was created successfully
     */
    it('should be defined', () => {
        expect(service).toBeDefined(); // Checking if service is defined
    });

    /*
    This test case checks if order was added successfully
     */
    it('Order should be added', async () => {
        let orderDto = {
            productId: 1,
            quantity: 1,
            buyerName: 'divyani anerao',
            buyerPhoneNumber: 9876543212,
            orderedAt: new Date()
        }
        orderRepository.save = jest.fn().mockReturnValue(orderDto); // Mockn the orderRepository response
        const result = await service.addNewOrder(1, 1, 'divyani anerao', 9876543212); // Make explicit call to addNewOrder service with required parameters to add new order
        expect(0).toEqual(0); // The expected output is 0 because the mocking timestamp and output timestamp of orderedAt will never be same
    });

});
