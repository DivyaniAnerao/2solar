/*
Description: This file is a controller to controll and redirect all the api requests
Auther: Divyani Anerao
*/
import {
    Controller,
    Post,
    Body,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import {ProductsService} from '../../service/products/products.service';
import {OrdersService} from '../../../orders/service/orders/orders.service';
import {ProductOrderDto, ProductObject} from '../../dto/productOrder.dto';
import {
    OK,
    PRODUCT_NOT_FOUND_MESSAGE,
    ORDER_NOT_ADDED,
    STOCK_NOT_UPDATED,
    ORDER_PRODUCT_ADDED
} from '../../../status'

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
            var resultProduct = [];
            resultProduct = productOrder.products.map(async (productObj) => { // return await this.makeProductOrder(productObj,productOrder)
                const products: ProductObject = await this.productsService.getProductById(productObj.productid);
                if (products == null) {
                    return {productid: productObj.productid, status: PRODUCT_NOT_FOUND_MESSAGE}
                }
                if (products.stock < productObj.quantity) {
                    let message: string = products.stock == 0 ? "Sorry! out of stock" : "Sorry! last " + products.stock + " are remaining.";
                    return {productid: productObj.productid, status: message}
                }
                const updatedStock: number = products.stock - productObj.quantity; // Calculate new stock for the product
                const status: number = await this.ordersService.addNewOrder(productObj.productid, productObj.quantity, productOrder.buyerName, productOrder.buyerPhoneNumber); // Make the order entry to database for new order
                if (status == 1) { // If the order was successfully added
                    const updatedStockPercentage: number = (updatedStock / products.minRequiredStock) * 100; // Calculate the stock percentage
                    const updateStatus = await this.productsService.updateProductStock(productObj.productid, updatedStockPercentage, updatedStock, products.mailSentFlag); // Update the stock details for the product
                    if (updateStatus == 1) {
                        return {productid: productObj.productid, status: ORDER_PRODUCT_ADDED}
                    } else {
                        return {productid: productObj.productid, status: STOCK_NOT_UPDATED}
                    }
                } else { // If order failed to add in database
                    return {productid: productObj.productid, status: ORDER_NOT_ADDED}
                }
            })
            const responses = await Promise.all(resultProduct)
            return {status: OK, result: responses}
        } catch (e) { // Handle the exception if thrown any
            return e;
        }
    }
}
