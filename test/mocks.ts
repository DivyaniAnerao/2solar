/* This file contains mock responses required for the testing
*/
//Product record from database
export const productsMock = {
    productId: 1,
    productName: 'solar',
    stock: 30,
    minRequiredStock: 30,
    stockPercentage: 100,
    mailSentFlag: 0
}

//Product record from database for out of order condition
export const productsMockOutofStock = {
  productId: 1,
  productName: 'solar',
  stock: 0,
  minRequiredStock: 30,
  stockPercentage: 100,
  mailSentFlag: 0
}

//order record in orders table
export const updatedProductMock = {
  productId:1,
  quantity:1,
  buyerName:"divyani anerao",
  buyerPhoneNumber:617812920,
  orderedAt : "10/10/2023"
}

//Input to the makeOrder by post request
export const inputDataMock ={
  buyerName: "divyani anerao",
  buyerPhoneNumber: 617812920,
  products: {
      productid: 1,
     quantity: 1
  }
}
