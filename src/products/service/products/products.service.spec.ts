/*
Description: This file tests the product service
Auther: Divyani Anerao
*/

import {Test, TestingModule} from '@nestjs/testing';
import {ProductsService} from './products.service';
import {getRepositoryToken} from '@nestjs/typeorm';
import {ConfigService} from '@nestjs/config';
import {Repository} from 'typeorm';
import {Products} from '../../../typeorm/products.entity';
import {MailerService} from '@nestjs-modules/mailer';

describe('ProductsService', () => {
    let service: ProductsService;
    let productRepository: Repository<Products>;
    let productRepositoryToken: string |Function = getRepositoryToken(Products);
    let mailerService: MailerService;

    /* Create testing module and required services/repositories before running each test cases */
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
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
                ConfigService, {
                    provide: productRepositoryToken,
                    useClass: Repository
                }
            ]
        }).compile();

        productRepository = module.get<Repository<Products>>(productRepositoryToken);
        service = module.get<ProductsService>(ProductsService);
        mailerService = module.get<MailerService>(MailerService);
    }, 60000);
    // This timeout was added to override the default 5000s timeout

    /*
    This test case checks if the service was created successfully
     */
    it('should be defined', () => {
        expect(service).toBeDefined(); // Checking if service is defined
    });

    /*
    This test case checks if call to sendMail was done when less than 20% stock is pending
     */
    it('Should call sendMail when less than 20% stock is pending', async () => {
        service.sendMail = jest.fn().mockReturnValue(1); // Mocking sendMail
        productRepository.update = jest.fn().mockReturnValue({affected: 1}); // Mocking update function in productRepository
        const result = await service.updateProductStock(1, 0, 0, 0); // Making an explicit call to product service's updateProductStock
        expect(service.sendMail).toHaveBeenCalledTimes(1); // Checking if the sendMail was called at 1 time
        expect(result).toEqual(1); // Checking if the execution returns expected output
    });

    /*
    This test case checks/confirms if sendMail is not called when the email was
    already send and stock is less than 20%
     */
    it('Should not call sendMail when the mail was already sent even less than 20% stock is pending', async () => {
        service.sendMail = jest.fn().mockReturnValue(1); // Mocking sendMail
        productRepository.update = jest.fn().mockReturnValue({affected: 1}); // Mocking update function in productRepository
        const result = await service.updateProductStock(1, 0, 0, 1); // Making an explicit call to product service's updateProductStock
        expect(service.sendMail).toHaveBeenCalledTimes(0); // Checking if the sendMail was called at 0 time
        expect(result).toEqual(1); // Checking if the execution returns expected output
    });
});
