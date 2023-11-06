/*
Description: This file contains DTOs for order modules
Auther: Divyani Anerao
*/

/* This interface specifies the structure of order in the database
*/
export interface  OrderDto{
    productId: number;
    quantity: number;
    buyerName: string;
    buyerPhoneNumber: number;
    orderedAt: Date
  }