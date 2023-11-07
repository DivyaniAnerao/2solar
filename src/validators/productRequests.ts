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
                    if (property == 'isArray') {
                        return Array.isArray(value);
                    }
                    if (Array.isArray(value)) {
                        if (property == 'productid') { // If productId is validated
                            let passCount = 0;
                            value.forEach(element => { // return true if productId exists on the object
                                if (typeof element === 'object' && element.productid != undefined && element.productid > 0) {
                                    passCount++;
                                }
                            });
                            return value.length == passCount
                        }
                        if (property == 'quantity') { // If quantity is validated
                            let passCount = 0;
                            value.forEach(element => { // return true if quantity exists on the object
                                if (typeof element === 'object' && element.quantity != undefined && element.quantity > 0) {
                                    passCount++;
                                }
                            });
                            return value.length == passCount
                        }
                    }
                }
            }
        });
    };
}
