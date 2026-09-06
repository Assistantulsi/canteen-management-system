/**
 * CampusBite - Mock REST API Service Layer
 * Simulates backend HTTP endpoints using LocalStorage as the persistent storage engine.
 * 
 * ARCHITECTURE NOTE FOR BACKEND DEVELOPERS:
 * When connecting to a real Node.js / Express / MongoDB / MySQL backend,
 * replace the LocalStorage read/write calls inside each method with real:
 *   return fetch('/api/...', { method: 'POST', body: JSON.stringify(...) }).then(res => res.json());
 */

const STORAGE_KEYS = {
  FOODS: "campusbite_foods",
  USERS: "campusbite_users",
  CURRENT_USER: "campusbite_current_user",
  ADMIN_SESSION: "campusbite_admin_session",
  ORDERS: "campusbite_orders",
  CART: "campusbite_cart",
  FAVORITES: "campusbite_favorites",
  INVENTORY: "campusbite_inventory",
  TRANSACTIONS: "campusbite_transactions",
  COUPONS: "campusbite_coupons",
  FEEDBACK: "campusbite_feedback",
  NOTIFICATIONS: "campusbite_notifications",
  THEME: "campusbite_theme"
};

const API = {
  // Initialize storage with realistic seed data if not present
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.FOODS) && typeof INITIAL_DATA !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.FOODS, JSON.stringify(INITIAL_DATA.foods));
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_DATA.users));
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_DATA.orders));
      localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(INITIAL_DATA.inventory));
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_DATA.walletTransactions));
      localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(INITIAL_DATA.coupons));
      localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(INITIAL_DATA.feedback));
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_DATA.notifications));
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(["FOOD_001", "FOOD_005", "FOOD_009"]));
      
      // Seed default active user session for instantaneous testing
      if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_DATA.users[0]));
      }
    }
  },

  // Helper to simulate realistic network delay
  _delay(ms = 120) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },

  // =========================================================================
  // 1. MENU & FOOD ITEMS ENDPOINTS
  // =========================================================================

  // TODO: Replace with: return fetch('/api/menu').then(res => res.json())
  async getMenu() {
    await this._delay();
    const foods = Utils.getStorage(STORAGE_KEYS.FOODS, []);
    return { success: true, data: foods };
  },

  // TODO: Replace with: return fetch(`/api/menu/${id}`).then(res => res.json())
  async getFoodById(id) {
    await this._delay();
    const foods = Utils.getStorage(STORAGE_KEYS.FOODS, []);
    const food = foods.find((item) => item.id === id);
    if (food) return { success: true, data: food };
    return { success: false, message: "Food item not found" };
  },

  // TODO: Replace with: return fetch('/api/admin/menu', { method: 'POST', body: JSON.stringify(foodData) })
  async addFood(foodData) {
    await this._delay();
    const foods = Utils.getStorage(STORAGE_KEYS.FOODS, []);
    const newFood = {
      id: `FOOD_${String(foods.length + 1).padStart(3, "0")}`,
      rating: 4.5,
      ratingCount: 1,
      isAvailable: true,
      ...foodData
    };
    foods.unshift(newFood);
    Utils.setStorage(STORAGE_KEYS.FOODS, foods);
    return { success: true, data: newFood, message: "Food item added successfully" };
  },

  // TODO: Replace with: return fetch(`/api/admin/menu/${id}`, { method: 'PUT', body: JSON.stringify(updates) })
  async updateFood(id, updates) {
    await this._delay();
    const foods = Utils.getStorage(STORAGE_KEYS.FOODS, []);
    const index = foods.findIndex((item) => item.id === id);
    if (index === -1) return { success: false, message: "Item not found" };
    foods[index] = { ...foods[index], ...updates };
    Utils.setStorage(STORAGE_KEYS.FOODS, foods);
    return { success: true, data: foods[index], message: "Food item updated" };
  },

  // TODO: Replace with: return fetch(`/api/admin/menu/${id}`, { method: 'DELETE' })
  async deleteFood(id) {
    await this._delay();
    let foods = Utils.getStorage(STORAGE_KEYS.FOODS, []);
    foods = foods.filter((item) => item.id !== id);
    Utils.setStorage(STORAGE_KEYS.FOODS, foods);
    return { success: true, message: "Food item removed from menu" };
  },

  // TODO: Replace with: return fetch(`/api/admin/menu/${id}/availability`, { method: 'PATCH' })
  async toggleAvailability(id) {
    await this._delay();
    const foods = Utils.getStorage(STORAGE_KEYS.FOODS, []);
    const item = foods.find((f) => f.id === id);
    if (!item) return { success: false, message: "Item not found" };
    item.isAvailable = !item.isAvailable;
    Utils.setStorage(STORAGE_KEYS.FOODS, foods);
    return { success: true, isAvailable: item.isAvailable, message: `Availability set to ${item.isAvailable}` };
  },

  // =========================================================================
  // 2. AUTHENTICATION & USER PROFILE
  // =========================================================================

  // TODO: Replace with: return fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
  async loginUser(identifier, password) {
    await this._delay(200);
    const users = Utils.getStorage(STORAGE_KEYS.USERS, []);
    const normalized = identifier.trim().toLowerCase();

    const user = users.find(
      (u) =>
        (u.email.toLowerCase() === normalized || u.id.toLowerCase() === normalized) &&
        u.password === password
    );

    if (!user) {
      return { success: false, message: "Invalid Student ID/Email or Password." };
    }

    if (user.isBlocked) {
      return { success: false, message: "Your account is currently suspended. Please contact Canteen Admin." };
    }

    Utils.setStorage(STORAGE_KEYS.CURRENT_USER, user);
    return { success: true, data: user, message: "Login successful" };
  },

  // TODO: Replace with: return fetch('/api/auth/register', { method: 'POST', body: JSON.stringify(userData) })
  async registerUser(userData) {
    await this._delay(250);
    const users = Utils.getStorage(STORAGE_KEYS.USERS, []);
    const exists = users.some(
      (u) =>
        u.email.toLowerCase() === userData.email.toLowerCase() ||
        u.id.toLowerCase() === userData.studentId.toLowerCase()
    );

    if (exists) {
      return { success: false, message: "Student with this ID or Email is already registered." };
    }

    const newUser = {
      id: userData.studentId,
      name: userData.fullName,
      email: userData.email,
      phone: userData.phone,
      department: userData.department,
      year: userData.year,
      password: userData.password,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
      walletBalance: 100.00, // Welcome bonus of ₹100!
      isBlocked: false,
      joinedDate: new Date().toISOString().split("T")[0],
      favorites: []
    };

    users.push(newUser);
    Utils.setStorage(STORAGE_KEYS.USERS, users);
    Utils.setStorage(STORAGE_KEYS.CURRENT_USER, newUser);

    // Add welcome transaction
    const txns = Utils.getStorage(STORAGE_KEYS.TRANSACTIONS, []);
    txns.unshift({
      id: `TXN_${Math.floor(100 + Math.random() * 900)}`,
      type: "credit",
      amount: 100.00,
      title: "🎉 Student Registration Welcome Bonus",
      date: new Date().toLocaleDateString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      status: "Successful",
      refOrder: null
    });
    Utils.setStorage(STORAGE_KEYS.TRANSACTIONS, txns);

    return { success: true, data: newUser, message: "Registration successful! ₹100 Welcome Bonus added to Wallet." };
  },

  getCurrentUser() {
    return Utils.getStorage(STORAGE_KEYS.CURRENT_USER, null);
  },

  logoutUser() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    return { success: true };
  },

  // TODO: Replace with: return fetch('/api/admin/login', { method: 'POST', body: JSON.stringify({ email, password }) })
  async loginAdmin(identifier, password) {
    await this._delay(200);
    const adminData = INITIAL_DATA.admin;
    const normalized = identifier.trim().toLowerCase();

    if (
      (normalized === adminData.email.toLowerCase() || normalized === adminData.id.toLowerCase()) &&
      password === adminData.password
    ) {
      Utils.setStorage(STORAGE_KEYS.ADMIN_SESSION, adminData);
      return { success: true, data: adminData, message: "Admin authenticated successfully" };
    }
    return { success: false, message: "Invalid Admin Credentials." };
  },

  getAdminSession() {
    return Utils.getStorage(STORAGE_KEYS.ADMIN_SESSION, null);
  },

  logoutAdmin() {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
    return { success: true };
  },

  async updateProfile(updates) {
    await this._delay();
    const user = this.getCurrentUser();
    if (!user) return { success: false, message: "Not logged in" };
    const updatedUser = { ...user, ...updates };
    Utils.setStorage(STORAGE_KEYS.CURRENT_USER, updatedUser);

    // Sync in global users array
    const users = Utils.getStorage(STORAGE_KEYS.USERS, []);
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx !== -1) {
      users[idx] = updatedUser;
      Utils.setStorage(STORAGE_KEYS.USERS, users);
    }
    return { success: true, data: updatedUser, message: "Profile updated successfully" };
  },

  // =========================================================================
  // 3. CART MANAGEMENT
  // =========================================================================

  getCart() {
    return Utils.getStorage(STORAGE_KEYS.CART, []);
  },

  saveCart(items) {
    Utils.setStorage(STORAGE_KEYS.CART, items);
    // Dispatch custom event for reactive UI updates across vanilla & React
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("campusbite_cart_updated", { detail: items }));
    }
    return items;
  },

  addToCart(foodItem, quantity = 1) {
    const cart = this.getCart();
    const existing = cart.find((item) => item.foodId === foodItem.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        foodId: foodItem.id,
        name: foodItem.name,
        price: foodItem.price,
        image: foodItem.image,
        isVeg: foodItem.isVeg,
        quantity: quantity
      });
    }
    this.saveCart(cart);
    return cart;
  },

  updateCartQuantity(foodId, quantity) {
    let cart = this.getCart();
    if (quantity <= 0) {
      cart = cart.filter((item) => item.foodId !== foodId);
    } else {
      const item = cart.find((item) => item.foodId === foodId);
      if (item) item.quantity = quantity;
    }
    this.saveCart(cart);
    return cart;
  },

  removeFromCart(foodId) {
    let cart = this.getCart();
    cart = cart.filter((item) => item.foodId !== foodId);
    this.saveCart(cart);
    return cart;
  },

  clearCart() {
    this.saveCart([]);
    return [];
  },

  // =========================================================================
  // 4. FAVORITES
  // =========================================================================

  getFavorites() {
    return Utils.getStorage(STORAGE_KEYS.FAVORITES, []);
  },

  toggleFavorite(foodId) {
    let favs = this.getFavorites();
    const index = favs.indexOf(foodId);
    let isFav = false;
    if (index > -1) {
      favs.splice(index, 1);
      isFav = false;
    } else {
      favs.push(foodId);
      isFav = true;
    }
    Utils.setStorage(STORAGE_KEYS.FAVORITES, favs);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("campusbite_favorites_updated", { detail: favs }));
    }
    return { isFavorite: isFav, favorites: favs };
  },

  // =========================================================================
  // 5. ORDERS & CHECKOUT
  // =========================================================================

  // TODO: Replace with: return fetch('/api/orders').then(res => res.json())
  async getOrders() {
    await this._delay();
    const orders = Utils.getStorage(STORAGE_KEYS.ORDERS, []);
    return { success: true, data: orders };
  },

  // TODO: Replace with: return fetch(`/api/orders/${orderId}`).then(res => res.json())
  async getOrderById(orderId) {
    await this._delay();
    const orders = Utils.getStorage(STORAGE_KEYS.ORDERS, []);
    const order = orders.find((o) => o.orderId.toUpperCase() === orderId.trim().toUpperCase());
    if (order) return { success: true, data: order };
    return { success: false, message: "Order not found" };
  },

  // TODO: Replace with: return fetch('/api/orders', { method: 'POST', body: JSON.stringify(orderData) })
  async createOrder(orderData) {
    await this._delay(300);
    const orders = Utils.getStorage(STORAGE_KEYS.ORDERS, []);
    const orderId = Utils.generateOrderId();
    const tokenNumber = Utils.generateTokenNumber(orderData.pickupCounter);

    const newOrder = {
      orderId,
      tokenNumber,
      orderTime: new Date().toISOString(),
      orderStatus: "Preparing", // Simulated immediate kitchen acceptance
      paymentStatus: "Successful",
      ...orderData
    };

    orders.unshift(newOrder);
    Utils.setStorage(STORAGE_KEYS.ORDERS, orders);

    // If paid via Wallet, deduct balance and add transaction
    if (orderData.paymentMethod === "Campus Wallet") {
      await this.deductWalletBalance(orderData.totalAmount, orderId);
    }

    // Add simulated notification
    this.addNotification({
      title: "Order Placed Successfully",
      message: `Your Order ${orderId} (Token ${tokenNumber}) is placed! Pickup: ${orderData.pickupCounter}.`,
      type: "order"
    });

    // Clear cart upon successful order
    this.clearCart();

    return { success: true, data: newOrder, message: "Order placed successfully!" };
  },

  // TODO: Replace with: return fetch(`/api/admin/orders/${orderId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })
  async updateOrderStatus(orderId, newStatus) {
    await this._delay();
    const orders = Utils.getStorage(STORAGE_KEYS.ORDERS, []);
    const order = orders.find((o) => o.orderId === orderId);
    if (!order) return { success: false, message: "Order not found" };
    order.orderStatus = newStatus;
    Utils.setStorage(STORAGE_KEYS.ORDERS, orders);

    // Trigger notification
    this.addNotification({
      title: `Order ${order.tokenNumber} Status Update`,
      message: `Order ${orderId} is now ${newStatus.toUpperCase()}.`,
      type: "order"
    });

    return { success: true, data: order, message: `Status updated to ${newStatus}` };
  },

  // =========================================================================
  // 6. WALLET & TRANSACTIONS
  // =========================================================================

  async getWalletBalance() {
    const user = this.getCurrentUser();
    return user ? Number(user.walletBalance) || 0 : 0;
  },

  async addWalletFunds(amount) {
    await this._delay(200);
    const user = this.getCurrentUser();
    if (!user) return { success: false, message: "Please log in to add funds" };
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) return { success: false, message: "Invalid amount" };

    user.walletBalance = (Number(user.walletBalance) || 0) + numAmount;
    Utils.setStorage(STORAGE_KEYS.CURRENT_USER, user);

    // Sync in global users
    const users = Utils.getStorage(STORAGE_KEYS.USERS, []);
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx !== -1) {
      users[idx] = user;
      Utils.setStorage(STORAGE_KEYS.USERS, users);
    }

    // Record transaction
    const txns = Utils.getStorage(STORAGE_KEYS.TRANSACTIONS, []);
    txns.unshift({
      id: `TXN_${Math.floor(100 + Math.random() * 900)}`,
      type: "credit",
      amount: numAmount,
      title: "Wallet Recharge (Instant UPI)",
      date: new Date().toLocaleDateString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      status: "Successful",
      refOrder: null
    });
    Utils.setStorage(STORAGE_KEYS.TRANSACTIONS, txns);

    return { success: true, balance: user.walletBalance, message: `₹${numAmount.toFixed(2)} added to wallet!` };
  },

  async deductWalletBalance(amount, refOrder) {
    const user = this.getCurrentUser();
    if (!user) return false;
    user.walletBalance = Math.max(0, (Number(user.walletBalance) || 0) - Number(amount));
    Utils.setStorage(STORAGE_KEYS.CURRENT_USER, user);

    // Sync in global users
    const users = Utils.getStorage(STORAGE_KEYS.USERS, []);
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx !== -1) {
      users[idx] = user;
      Utils.setStorage(STORAGE_KEYS.USERS, users);
    }

    // Record debit transaction
    const txns = Utils.getStorage(STORAGE_KEYS.TRANSACTIONS, []);
    txns.unshift({
      id: `TXN_${Math.floor(100 + Math.random() * 900)}`,
      type: "debit",
      amount: Number(amount),
      title: `Order Payment (${refOrder})`,
      date: new Date().toLocaleDateString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      status: "Successful",
      refOrder: refOrder
    });
    Utils.setStorage(STORAGE_KEYS.TRANSACTIONS, txns);
    return true;
  },

  async getTransactions() {
    await this._delay();
    return Utils.getStorage(STORAGE_KEYS.TRANSACTIONS, []);
  },

  // =========================================================================
  // 7. COUPONS & OFFERS
  // =========================================================================

  async getCoupons() {
    await this._delay();
    return Utils.getStorage(STORAGE_KEYS.COUPONS, []);
  },

  async validateCoupon(code, subtotal) {
    await this._delay(100);
    const coupons = Utils.getStorage(STORAGE_KEYS.COUPONS, []);
    const coupon = coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive);

    if (!coupon) {
      return { success: false, message: "Invalid or expired coupon code." };
    }

    if (subtotal < coupon.minOrder) {
      return { success: false, message: `Minimum order of ₹${coupon.minOrder} required for ${coupon.code}.` };
    }

    let discount = 0;
    if (coupon.discountPercent) {
      discount = (subtotal * coupon.discountPercent) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else if (coupon.discountAmount) {
      discount = coupon.discountAmount;
    }

    discount = Math.min(discount, subtotal);

    return {
      success: true,
      data: {
        code: coupon.code,
        discount: Math.round(discount),
        description: coupon.description
      },
      message: `Coupon '${coupon.code}' applied! Saved ₹${Math.round(discount)}`
    };
  },

  async addCoupon(couponData) {
    await this._delay();
    const coupons = Utils.getStorage(STORAGE_KEYS.COUPONS, []);
    coupons.unshift({
      ...couponData,
      usedCount: 0,
      isActive: true
    });
    Utils.setStorage(STORAGE_KEYS.COUPONS, coupons);
    return { success: true, message: "Offer coupon created successfully" };
  },

  // =========================================================================
  // 8. INVENTORY MANAGEMENT
  // =========================================================================

  async getInventory() {
    await this._delay();
    return Utils.getStorage(STORAGE_KEYS.INVENTORY, []);
  },

  async updateInventoryStock(id, newStock) {
    await this._delay();
    const items = Utils.getStorage(STORAGE_KEYS.INVENTORY, []);
    const item = items.find((i) => i.id === id);
    if (!item) return { success: false, message: "Item not found" };

    item.currentStock = Number(newStock);
    if (item.currentStock <= 0) {
      item.status = "Out of Stock";
    } else if (item.currentStock <= item.minStock) {
      item.status = "Low Stock";
    } else {
      item.status = "In Stock";
    }
    item.lastRestocked = new Date().toISOString().split("T")[0];

    Utils.setStorage(STORAGE_KEYS.INVENTORY, items);
    return { success: true, data: item, message: "Stock updated successfully" };
  },

  // =========================================================================
  // 9. CUSTOMERS & ADMIN STATS
  // =========================================================================

  async getCustomers() {
    await this._delay();
    const users = Utils.getStorage(STORAGE_KEYS.USERS, []);
    const orders = Utils.getStorage(STORAGE_KEYS.ORDERS, []);

    // Enrich users with orders count and total spend
    const enriched = users.map((u) => {
      const userOrders = orders.filter((o) => o.studentId === u.id);
      const totalSpend = userOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
      return {
        ...u,
        totalOrders: userOrders.length,
        totalSpend
      };
    });

    return { success: true, data: enriched };
  },

  async toggleBlockCustomer(studentId) {
    await this._delay();
    const users = Utils.getStorage(STORAGE_KEYS.USERS, []);
    const user = users.find((u) => u.id === studentId);
    if (!user) return { success: false, message: "User not found" };
    user.isBlocked = !user.isBlocked;
    Utils.setStorage(STORAGE_KEYS.USERS, users);
    return { success: true, isBlocked: user.isBlocked, message: `Student status updated to ${user.isBlocked ? "Blocked" : "Active"}` };
  },

  // =========================================================================
  // 10. FEEDBACK & NOTIFICATIONS
  // =========================================================================

  async getFeedback() {
    await this._delay();
    return Utils.getStorage(STORAGE_KEYS.FEEDBACK, []);
  },

  async submitFeedback(feedbackData) {
    await this._delay();
    const feedbackList = Utils.getStorage(STORAGE_KEYS.FEEDBACK, []);
    const newFeedback = {
      id: `REV_${String(feedbackList.length + 1).padStart(3, "0")}`,
      date: new Date().toISOString().split("T")[0],
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      ...feedbackData
    };
    feedbackList.unshift(newFeedback);
    Utils.setStorage(STORAGE_KEYS.FEEDBACK, feedbackList);
    return { success: true, data: newFeedback, message: "Thank you for your feedback!" };
  },

  getNotifications() {
    return Utils.getStorage(STORAGE_KEYS.NOTIFICATIONS, []);
  },

  addNotification(notif) {
    const list = this.getNotifications();
    list.unshift({
      id: `NOTIF_${Date.now()}`,
      time: "Just now",
      isRead: false,
      ...notif
    });
    Utils.setStorage(STORAGE_KEYS.NOTIFICATIONS, list);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("campusbite_notifications_updated", { detail: list }));
    }
  },

  markAllNotificationsRead() {
    const list = this.getNotifications();
    list.forEach((n) => (n.isRead = true));
    Utils.setStorage(STORAGE_KEYS.NOTIFICATIONS, list);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("campusbite_notifications_updated", { detail: list }));
    }
  },

  // Admin Dashboard aggregated metrics
  async getAdminStats() {
    await this._delay();
    const orders = Utils.getStorage(STORAGE_KEYS.ORDERS, []);
    const foods = Utils.getStorage(STORAGE_KEYS.FOODS, []);
    const users = Utils.getStorage(STORAGE_KEYS.USERS, []);
    const inventory = Utils.getStorage(STORAGE_KEYS.INVENTORY, []);

    const totalSales = orders.reduce((acc, o) => acc + (Number(o.totalAmount) || 0), 0);
    const pendingOrders = orders.filter((o) => ["Pending", "Confirmed", "Preparing"].includes(o.orderStatus)).length;
    const completedOrders = orders.filter((o) => o.orderStatus === "Completed").length;
    const lowStockItems = inventory.filter((i) => i.status === "Low Stock" || i.status === "Out of Stock").length;

    return {
      todayOrders: orders.length,
      totalSales,
      pendingOrders,
      completedOrders,
      totalCustomers: users.length,
      availableFoods: foods.filter((f) => f.isAvailable).length,
      lowStockItems
    };
  }
};

// Initialize on script load
API.init();

// Expose globally
if (typeof window !== "undefined") {
  window.API = API;
  window.STORAGE_KEYS = STORAGE_KEYS;
}
