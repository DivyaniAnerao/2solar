/*
Description: This file is created to define all product related services
Auther: Divyani Anerao
*/
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Products} from '../../../typeorm/products.entity';
import {MailerService} from '@nestjs-modules/mailer';
import {ORDER_SUCCESS, ORDER_ERROR} from '../../../status'
import {ConfigService} from '@nestjs/config';
import {ProductObject} from '../../dto/productOrder.dto';
import fs from 'fs';

@Injectable()
export class ProductsService { /* All the required repositories and services are injected in the constructor
    */
    constructor(@InjectRepository(Products)private productRepository : Repository < Products >, private readonly mailerService : MailerService, private readonly config : ConfigService) {}

    /* This function is written to fetch and return the product details from the given productId
    */
    async getProductById(productId : number):Promise<ProductObject> {
        return await this.productRepository.findOne({
            where: {
                "productId": productId
            }
        }); // Using repository to find the product
    }


    /* This function is written update the product's stock and stock percentage. This function also sends mail to the wholesaler
    when the stock percentage reaches below 20%
    */
    async updateProductStock(productid : number, updatedStockPercentage : number, updatedStock : number, mailSentFlag : number) {
        try {
            const newProductDetails = {
                "stock": updatedStock,
                "stockPercentage": updatedStockPercentage
            }
            // Update the product for new stock and percentage
            const updatedProduct = await this.productRepository.update({
                productId: productid
            }, newProductDetails);
            // If updated successfully
            if (updatedProduct.affected == 1) { // If the stock percentage was less than 20% and email was not sent before send the mail
                
                 if (updatedStockPercentage < 20 && mailSentFlag != 1) {
                    let subject = "Stock needs to refill";
                    const mailStatus:number = await this.sendMail(productid,subject,'refill'); // Sending mail to wholesaler
                    if (mailStatus == 1) { // If mail was sent successfully
                        await this.productRepository.update({
                            productId: productid
                        }, {mailSentFlag: 1});
                        // Update the mail sent Flag to avoid the
                        // sending mails again in future
                    }
                }
                return ORDER_SUCCESS;
            } else { // If not updated successfully
                return ORDER_ERROR;
            }
        } catch (e) {
            return e
        }
    }

    /*
This function is used to send the mail
 */
    async sendMail(productid: number,subject:string,templateName:string): Promise < number > { // Using mailerService to send the mail
        //let template = fs.readFileSync('./src/templates/','utf8');
        const mailStatus = await this.mailerService.sendMail(
            {
                to: this.config.get('WHOLESALER_EMAIL_ADDRE'), // Static wholesaler email address from env
                from: this.config.get('SYSTEM_EMAIL_ADDR'), // Static system email address from env
                subject: subject,
                template: __dirname + '/../../../../templates/'+templateName,
                context: { 
                    productId: productid
                  },
            }
        )
        // If the mail service return with success then return 1 else o
        return mailStatus.messageId != undefined && mailStatus.envelope != undefined ? 1 : 0;

    }
}
