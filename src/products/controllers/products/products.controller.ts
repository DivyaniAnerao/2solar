/*
Description: This file is a controller to controll and redirect all the api requests
Auther: Divyani Anerao
*/
import {
    Controller,
    Post,
    Body,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import {ProductsService} from '../../service/products/products.service';
import {OrdersService} from '../../../orders/service/orders/orders.service';
import {ProductOrderDto, ProductObject} from '../../dto/productOrder.dto';
import {ORDER_ERROR, OK, PRODUCT_NOT_FOUND_ERROR} from '../../../status'

@Controller('products')
export class ProductsController { /* All the required repositories and services are injected in the constructor
*/
    constructor(private productsService : ProductsService, private ordersService : OrdersService) {}

    /* This is a POST route for /products. This makes order for the product
    */
    @Post()
    @UsePipes(ValidationPipe)
    async makeOrder(@Body()productOrder : ProductOrderDto) {
        try { // get the product details from the database for given productId
            const products: ProductObject = await this.productsService.getProductById(productOrder.products.productid);
            // If the product stock is less than requested return the out of stock response
            if(Object.keys(products).length == 0){ return PRODUCT_NOT_FOUND_ERROR; }
            if (products.stock < productOrder.products.quantity) {
                let message:string = products.stock == 0 ? "Sorry! out of stock" : "Sorry! last " + productOrder.products.quantity + " are remaining.";
                return {status: OK, message}
            }

            // Calculate new stock for the product
            const updatedStock: number = products.stock - productOrder.products.quantity;
            // Make the order entry to database for new order
            const status: number = await this.ordersService.addNewOrder(productOrder.products.productid, productOrder.products.quantity, productOrder.buyerName, productOrder.buyerPhoneNumber);

            if (status == 1) {
                // If the order was successfully added
                // Calculate the stock percentage
                const updatedStockPercentage: number = (updatedStock / products.minRequiredStock) * 100;
                // Update the stock details for the product
                return this.productsService.updateProductStock(productOrder.products.productid, updatedStockPercentage, updatedStock, products.mailSentFlag);

            } else { // If order failed to add in database
                return ORDER_ERROR;
            }

        } catch (e) { // Handle the exception if thrown any
            return e;
        }
    }
}
