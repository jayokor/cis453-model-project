export const endpoints = {
  // public
  restaurants: () => `/restaurants`,
  restaurant: (id) => `/restaurants/${id}`,
  menu: (id) => `/restaurants/${id}/menu`,

  // auth
  register: () => `/auth/register`,
  login: () => `/auth/login`,
  me: () => `/auth/me`,

  // cart
  cart: () => `/cart`,
  cartItems: () => `/cart/items`,
  cartItem: (menuItemId) => `/cart/items/${menuItemId}`,

  // orders (customer)
  orders: () => `/orders`,
  orderById: (id) => `/orders/${id}`,

  // restaurant role
  restaurantOrders: () => `/restaurant/orders`,
  restaurantOrderById: (id) => `/restaurant/orders/${id}`,
  restaurantOrderStatus: (id) => `/restaurant/orders/${id}/status`,

  // admin
  adminRestaurants: () => `/admin/restaurants`,
  adminRestaurantEnabled: (id) => `/admin/restaurants/${id}/enabled`,
  adminRestaurantUsers: () => `/admin/restaurant-users`,
  adminOnboard: () => `/admin/onboard-restaurant`,

  adminOrders: () => `/admin/orders`,
  adminOrderById: (id) => `/admin/orders/${id}`,
};