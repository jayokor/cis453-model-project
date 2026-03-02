import { api } from "./client";
import { endpoints } from "./endpoints";

// auth
export async function loginApi(email, password) {
  const res = await api.post(endpoints.login(), { email, password });
  return res.data;
}
export async function registerApi(payload) {
  const res = await api.post(endpoints.register(), payload);
  return res.data;
}
export async function meApi() {
  const res = await api.get(endpoints.me());
  return res.data;
}

// restaurants
export async function fetchRestaurants(params = {}) {
  const res = await api.get(endpoints.restaurants(), { params });
  return res.data;
}
export async function fetchRestaurant(id) {
  const res = await api.get(endpoints.restaurant(id));
  return res.data;
}
export async function fetchMenu(id) {
  const res = await api.get(endpoints.menu(id));
  return res.data;
}

// cart
export async function fetchCart() {
  const res = await api.get(endpoints.cart());
  return res.data;
}
export async function addCartItem(menuItemId, quantity = 1) {
  const res = await api.post(endpoints.cartItems(), { menuItemId, quantity });
  return res.data;
}
export async function updateCartItem(menuItemId, quantity) {
  const res = await api.patch(endpoints.cartItem(menuItemId), { quantity });
  return res.data;
}
export async function removeCartItem(menuItemId) {
  const res = await api.delete(endpoints.cartItem(menuItemId));
  return res.data;
}
export async function clearCart() {
  const res = await api.delete(endpoints.cart());
  return res.data;
}

// orders (customer)
export async function createOrder() {
  const res = await api.post(endpoints.orders());
  return res.data;
}
export async function fetchMyOrders() {
  const res = await api.get(endpoints.orders());
  return res.data;
}
export async function fetchOrderById(id) {
  const res = await api.get(endpoints.orderById(id));
  return res.data;
}

// restaurant role
export async function fetchRestaurantOrders() {
  const res = await api.get(endpoints.restaurantOrders());
  return res.data;
}
export async function fetchRestaurantOrderById(orderId) {
  const res = await api.get(endpoints.restaurantOrderById(orderId));
  return res.data;
}
export async function updateRestaurantOrderStatus(orderId, status) {
  const res = await api.patch(endpoints.restaurantOrderStatus(orderId), { status });
  return res.data;
}

// admin
export async function fetchAdminRestaurants() {
  const res = await api.get(endpoints.adminRestaurants());
  return res.data;
}
export async function createRestaurant(payload) {
  const res = await api.post(endpoints.adminRestaurants(), payload);
  return res.data;
}
export async function createRestaurantOwner(payload) {
  const res = await api.post(endpoints.adminRestaurantUsers(), payload);
  return res.data;
}
export async function listAdminOrders(restaurantId = null) {
  const res = await api.get(endpoints.adminOrders(), {
    params: restaurantId ? { restaurant_id: restaurantId } : {},
  });
  return res.data;
}
export async function getAdminOrderById(orderId) {
  const res = await api.get(endpoints.adminOrderById(orderId));
  return res.data;
}
export async function setRestaurantEnabled(id, enabled) {
  const res = await api.patch(endpoints.adminRestaurantEnabled(id), { enabled });
  return res.data;
}
