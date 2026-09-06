/**
 * CampusBite - React DashboardWidgets Component
 * Student dashboard summary statistics, Today's Special banner,
 * smart meal recommendations, and recent orders with 1-click reorder.
 */

function DashboardWidgets() {
  const [user, setUser] = React.useState(null);
  const [orders, setOrders] = React.useState([]);
  const [foods, setFoods] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      const currentUser = API.getCurrentUser();
      setUser(currentUser);

      const [ordersRes, menuRes] = await Promise.all([
        API.getOrders(),
        API.getMenu()
      ]);

      if (ordersRes.success) setOrders(ordersRes.data);
      if (menuRes.success) setFoods(menuRes.data);
      setLoading(false);
    }
    loadDashboard();
  }, []);

  // Filter student orders
  const studentOrders = React.useMemo(() => {
    if (!user) return [];
    return orders.filter((o) => o.studentId === user.id || o.studentEmail === user.email);
  }, [orders, user]);

  const totalOrders = studentOrders.length;
  const pendingOrders = studentOrders.filter((o) => ["Pending", "Confirmed", "Preparing"].includes(o.orderStatus)).length;
  const completedOrders = studentOrders.filter((o) => o.orderStatus === "Completed").length;
  const walletBalance = user ? Number(user.walletBalance) || 0 : 0;

  // Meal of the hour recommendation
  const recommendedCategory = React.useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 11) return "Breakfast";
    if (hour < 16) return "Meals";
    if (hour < 19) return "Snacks";
    return "Fast Food";
  }, []);

  const recommendedFoods = foods.filter((f) => f.category === recommendedCategory).slice(0, 4);
  const todaySpecial = foods.find((f) => f.isSpecial) || foods[0];

  // 1-Click Reorder handler
  const handleReorder = (order) => {
    order.items.forEach((item) => {
      const fullFood = foods.find((f) => f.id === item.foodId) || {
        id: item.foodId,
        name: item.name,
        price: item.price,
        image: item.image,
        isVeg: true
      };
      API.addToCart(fullFood, item.quantity);
    });
    Utils.showToast("Items added back to your cart! 🛒", "success");
    setTimeout(() => {
      window.location.href = "cart.html";
    }, 500);
  };

  const handleOrderSpecial = (food) => {
    API.addToCart(food, 1);
    Utils.showToast(`Added Today's Special: ${food.name}! 🌟`, "success");
    setTimeout(() => {
      window.location.href = "cart.html";
    }, 400);
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <i className="fa-solid fa-circle-notch fa-spin fa-2x"></i>
        <p>Loading your campus dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-widgets-container">
      {/* 4 Summary Stat Cards */}
      <div className="stat-cards-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-orange">
            <i className="fa-solid fa-receipt"></i>
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Orders</span>
            <span className="stat-value">{totalOrders}</span>
            <span className="stat-trend positive">
              <i className="fa-solid fa-arrow-trend-up"></i> Lifetime campus meals
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-blue">
            <i className="fa-solid fa-fire-burner"></i>
          </div>
          <div className="stat-info">
            <span className="stat-label">Active / Pending</span>
            <span className="stat-value">{pendingOrders}</span>
            <span className="stat-trend">
              <i className="fa-solid fa-clock"></i> In kitchen queue
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-green">
            <i className="fa-solid fa-circle-check"></i>
          </div>
          <div className="stat-info">
            <span className="stat-label">Completed Orders</span>
            <span className="stat-value">{completedOrders}</span>
            <span className="stat-trend positive">
              <i className="fa-solid fa-check-double"></i> Picked up successfully
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-orange">
            <i className="fa-solid fa-wallet"></i>
          </div>
          <div className="stat-info">
            <span className="stat-label">Wallet Balance</span>
            <span className="stat-value">₹{walletBalance.toFixed(2)}</span>
            <a href="wallet.html" className="stat-trend positive text-primary font-bold">
              <i className="fa-solid fa-plus-circle"></i> Recharge Wallet
            </a>
          </div>
        </div>
      </div>

      {/* Today's Special Banner */}
      {todaySpecial && (
        <div className="today-special-banner">
          <div className="special-content">
            <span className="special-tag"><i className="fa-solid fa-star"></i> CHEF'S SPECIAL TODAY</span>
            <h2 className="special-title">{todaySpecial.name}</h2>
            <p className="special-desc">{todaySpecial.description}</p>
            <div className="special-meta">
              <span className="special-price">₹{todaySpecial.price}</span>
              <span className="special-prep"><i className="fa-regular fa-clock"></i> {todaySpecial.prepTime}</span>
              <span className="special-rating"><i className="fa-solid fa-star text-amber"></i> {todaySpecial.rating}</span>
            </div>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => handleOrderSpecial(todaySpecial)}
            >
              <i className="fa-solid fa-cart-plus"></i> Quick Order Special
            </button>
          </div>
          <div className="special-media">
            <img src={todaySpecial.image} alt={todaySpecial.name} className="special-img" />
          </div>
        </div>
      )}

      {/* Recommended For You Section */}
      <div className="dashboard-section">
        <div className="section-title-row">
          <div>
            <h3 className="section-heading">
              <i className="fa-solid fa-wand-magic-sparkles text-primary"></i> Recommended for You
            </h3>
            <p className="section-caption">Curated popular choices for your {recommendedCategory} break</p>
          </div>
          <a href="menu.html" className="btn btn-outline-primary btn-sm">
            View Full Menu <i className="fa-solid fa-arrow-right"></i>
          </a>
        </div>

        <div className="food-grid">
          {recommendedFoods.map((food) => (
            <div
              key={food.id}
              className="food-card"
              onClick={() => App.openFoodDetails(food.id)}
            >
              <div className="food-card-img-wrapper">
                <img src={food.image} alt={food.name} className="food-card-img" />
                <div className="card-top-badges">
                  <span className={`diet-tag ${food.isVeg ? "diet-veg" : "diet-nonveg"}`}>
                    <i className="fa-solid fa-circle"></i> {food.isVeg ? "Veg" : "Non-Veg"}
                  </span>
                </div>
              </div>
              <div className="food-card-body">
                <div className="food-card-meta">
                  <span className="food-category-label">{food.category}</span>
                  <span className="food-card-rating">
                    <i className="fa-solid fa-star"></i> {food.rating}
                  </span>
                </div>
                <h4 className="food-card-title">{food.name}</h4>
                <div className="food-card-footer">
                  <span className="food-price">₹{food.price}</span>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      API.addToCart(food, 1);
                      Utils.showToast(`Added ${food.name} to Cart 🛒`, "success");
                    }}
                  >
                    <i className="fa-solid fa-cart-plus"></i> Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders Section with 1-Click Reorder */}
      <div className="dashboard-section">
        <div className="section-title-row">
          <div>
            <h3 className="section-heading">
              <i className="fa-solid fa-clock-rotate-left text-primary"></i> Recent Orders
            </h3>
            <p className="section-caption">Reorder your favorite college meals in one tap</p>
          </div>
          <a href="orders.html" className="btn btn-secondary btn-sm">
            All Orders ({studentOrders.length})
          </a>
        </div>

        {studentOrders.length === 0 ? (
          <div className="card p-4 text-center">
            <p className="text-muted">You have not placed any orders yet.</p>
            <a href="menu.html" className="btn btn-primary btn-sm mt-2">Start Your First Order</a>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date & Time</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {studentOrders.slice(0, 4).map((order) => (
                  <tr key={order.orderId}>
                    <td>
                      <strong>{order.orderId}</strong>
                      <span className="d-block text-muted text-xs">Token: #{order.tokenNumber}</span>
                    </td>
                    <td>{Utils.formatDate(order.orderTime)}</td>
                    <td>
                      {order.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
                    </td>
                    <td><strong>₹{order.totalAmount}</strong></td>
                    <td>
                      <span className={`badge-status status-${order.orderStatus.toLowerCase()}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td>
                      <div className="action-btns-group">
                        <a
                          href={`tracking.html?orderId=${order.orderId}`}
                          className="btn btn-secondary btn-sm"
                          title="Track Live"
                        >
                          <i className="fa-solid fa-satellite-dish"></i> Track
                        </a>
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => handleReorder(order)}
                          title="Reorder items"
                        >
                          <i className="fa-solid fa-repeat"></i> Reorder
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Expose component to window
window.DashboardWidgets = DashboardWidgets;
