/*
Description: This file product requests custom  validation function
Auther: Divyani Anerao
*/
import {registerDecorator, ValidationOptions, ValidationArguments} from 'class-validator';

/* This function validates the order object in the product object
*/
export function ValidateOrderObject(property: string, validationOptions ?:ValidationOptions) {
    return(object : any, propertyName : string) => {
        registerDecorator({
            name: 'ValidateOrderObject',
            target: object.constructor,
            propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value : any, args : ValidationArguments) {
                    if (property == 'productid') {
                        // If productId is validated
                        // return true if productId exists on the object
                        return typeof value === 'object' && value.productid != undefined && value.productid > 0
                    }
                    if (property == 'quantity') {
                        // If quantity is validated
                        // return true if quantity exists on the object
                        return typeof value === 'object' && value.quantity != undefined && value.quantity > 0;
                    }
                }
            }
        });
    };
}
