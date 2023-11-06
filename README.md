
## Description
products.controllers.ts is the main controller of the api. The products request will be handled my makeOrder()
in products.controllers.ts

## API Details
 - Post request
 URL at local: localhost:3000/products
 - Example of Body input
 {
    "buyerName": "divyani anerao",
    "buyerPhoneNumber": 617812920,
    "products": {
        "productid": 1,
        "quantity": 1
    }
}

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start
```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

