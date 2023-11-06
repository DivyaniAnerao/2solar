/*
Description: This file holds all product related DTOs
Auther: Divyani Anerao
*/
import {IsNotEmpty, IsString} from 'class-validator';
import {ValidateOrderObject} from '../../validators/productRequests'

/* This class is used to define structure for order coming from post request
*/
export class Order {
    productid : number;
    quantity : number;
}

/* This class defines the structure for product dto object that is coming as input from post request
It is also validated for valid inputs to avoid wrong inputs from user.
*/
export class ProductOrderDto {
    @IsNotEmpty()
    @IsString()
    buyerName : string;
    @IsNotEmpty()
    buyerPhoneNumber : number;
    @ValidateOrderObject('productid', {message: 'Invalid product id'})
    @ValidateOrderObject('quantity', {message: 'Invalid quantity'})
    products : Order;
}

/* This interface specifies the structure of product in the database
*/
export interface ProductObject {
    productId: number,
    productName: string,
    stock: number,
    minRequiredStock: number,
    stockPercentage: number,
    mailSentFlag: number
}
