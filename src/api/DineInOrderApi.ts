import axios from "axios";

export interface OrderRequestItem {
  dishCode: string;
  quantity: number;
}

export interface DineInOrderRequest {
  tableName: string;
  items: OrderRequestItem[];
}

export interface DineInOrderResponse {
  code: number;
  orderId: number;
}

const DINE_IN_API_URL = process.env.REACT_APP_API_URL;
const DINE_IN_ORDER_PATH = "/api/dine-in/order";

const DINE_IN_API_PATH = `${DINE_IN_API_URL}${DINE_IN_ORDER_PATH}`;
const UPDATE_ORDER_STATUS_PATH = `${DINE_IN_API_URL}/api/dine-in/order-status`;

export async function createDineInOrder(request: DineInOrderRequest) {
  const response = await axios.post(DINE_IN_API_PATH, request);
  const resData: DineInOrderResponse = response.data;
  return resData;
}

export async function getDineInOrder() {
  const response = await axios.get(DINE_IN_API_PATH);
  return response.data;
}

export async function changeOrderStatus(orderId: number, status: string) {
  const response = await axios.put(
    `${UPDATE_ORDER_STATUS_PATH}/${orderId}`,
    null,
    {
      params: {
        status,
      },
    }
  );
  return response.data;
}
