const SUCCESS_CREATED = 201;
export const OK = 200;

const SUCCESS_CREATED_MESSAGE = "Order placed successfully!";
const COMMON_ERROR_MESSAGE = "Sorry! Something went wrong!";

export const ORDER_SUCCESS = {
    status: SUCCESS_CREATED,
    message: SUCCESS_CREATED_MESSAGE
}
export const ORDER_ERROR = {
    status: OK,
    message: COMMON_ERROR_MESSAGE
}