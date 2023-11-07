/*
Description: This file contains test cases for product controller
Auther: Divyani Anerao
*/
import {Test, TestingModule} from '@nestjs/testing';
import {ProductsController} from './products.controller';
import {ProductsService} from '../../service/products/products.service';
import {ConfigService} from '@nestjs/config';
import {OrdersService} from '../../../orders/service/orders/orders.service';
import {Repository} from 'typeorm';
import {Products} from '../../../typeorm/products.entity';
import {getRepositoryToken} from '@nestjs/typeorm';
import {MailerService} from '@nestjs-modules/mailer';
import {Orders} from '../../../typeorm/orders.entity';
import {productsMock, inputDataMock, productsMockOutofStock,errorOrderStatusMock,resultForvalidInputMock, ourOfOrderResponseMock} from '../../../../test/mocks';

describe('ProductsController', () => { // Dependancy declarations
    let controller: ProductsController;
    let productsService: ProductsService;
    let ordersService: OrdersService;
    let productRepository: Repository<Products>;
    let mailerService: MailerService;
    let orderRepository: Repository<Orders>;
    let productRepositoryToken: string |Function = getRepositoryToken(Products);
    let orderRepositoryToken: string |Function = getRepositoryToken(Orders);

    beforeEach(async () => { /* Create testing module and required services/repositories before running each test cases */
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProductsController],
            providers: [
                { // Configurations required for mailerService
                    name: 'MAILER_OPTIONS',
                    provide: 'MAILER_OPTIONS',
                    useValue: {
                        transport: {
                            host: 'smtp.gmail.com',
                            auth: {
                                user: 'aneraodivyani@gmail.com',
                                pass: 'uyjcteepkrstdkkp'
                            }
                        }
                    }
                },
                MailerService,
                ProductsService,
                OrdersService,
                ConfigService, {
                    provide: productRepositoryToken,
                    useClass: Repository
                }, {
                    provide: orderRepositoryToken,
                    useClass: Repository
                }
            ]
        }).compile();

        orderRepository = module.get<Repository<Orders>>(orderRepositoryToken);
        productRepository = module.get<Repository<Products>>(productRepositoryToken);
        controller = module.get<ProductsController>(ProductsController);
        productsService = module.get<ProductsService>(ProductsService);
        ordersService = module.get<OrdersService>(OrdersService);
        controller = module.get<ProductsController>(ProductsController);
    });

    /*
    This test case checks if the product controller was created successfully
     */
    it('should be defined', () => {
        expect(controller).toBeDefined(); // Checking if controller is defined
    });

    /*
    This test case checks if Order was placed successfully for valid inputs
     */
    it('Order should be placed successfully for valid inputs', async () => {
        productRepository.findOne = jest.fn().mockReturnValue(productsMock); // Mocking productRepository to return a product details
        ordersService.addNewOrder = jest.fn().mockReturnValue(1); // Mocking ordersService addNewOrder to add order in order table
        productsService.sendMail = jest.fn().mockReturnValue(1); // Mocking sendMail
        productRepository.update = jest.fn().mockReturnValue({affected: 1}); // Mocking productRepository to update's success
        const result = await controller.makeOrder(inputDataMock); // Making an explicit call to makeOrder for the input
        expect(result).toEqual(resultForvalidInputMock); // Check if the execution returns correct expected output
    });

    /*
    This test case checks if error response is returned for out of stock condition
     */
    it('Should error for out of stock condition', async () => {
            // Response code out of stock
        productRepository.findOne = jest.fn().mockReturnValue(productsMockOutofStock); // Mocking productRepository to return a product details for out of stock condition
        const result = await controller.makeOrder(inputDataMock) // Making an explicit call to makeOrder for the input
        expect(result).toEqual(ourOfOrderResponseMock); // Check if the execution returns correct expected output
    });

    /*
    This test case checks if error response is returned if order was failed to add
     */
    it('Return error if order was failed to add', async () => {
        productRepository.findOne = jest.fn().mockReturnValue(productsMock); // Mocking to get the product details
        ordersService.addNewOrder = jest.fn().mockReturnValue(0); // Mocking to fail the addNewOrder
        productsService.sendMail = jest.fn().mockReturnValue(1); // Mocking to mailSend success
        productRepository.update = jest.fn().mockReturnValue({affected: 1}); // product update success mock
        const result = await controller.makeOrder(inputDataMock); // Making an explicit call to makeOrder for the input
        expect(result).toEqual(errorOrderStatusMock); // Check if the execution returns correct expected output
    });


});
