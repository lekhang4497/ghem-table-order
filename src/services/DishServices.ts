import { DISH_TYPES, DISHES, DishInfo, DishTypeInfo } from "../dishes";

export async function getAllDishInfo(): Promise<DishInfo[]> {
  return DISHES;
}

export async function getAllDishType(): Promise<DishTypeInfo[]> {
  return DISH_TYPES;
}

export default getAllDishInfo;
