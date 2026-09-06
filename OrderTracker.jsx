/**
 * CampusBite - React OrderTracker Component
 * Live Order Tracking with real-time 5-stage timeline, animated kitchen status,
 * countdown timer, pickup counter details, and interactive status simulation.
 */

function OrderTracker() {
  const [order, setOrder] = React.useState(null);
  const [searchId, setSearchId] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [countdown, setCountdown] = React.useState(420); // 7 minutes in seconds

  const stages = [
    { key: "Pending", label: "Order Placed", icon: "fa-receipt", desc: "Received at canteen terminal" },
    { key: "Confirmed", label: "Payment Confirmed", icon: "fa-circle-check", desc: "Verified via UPI/Wallet" },
    { key: "Preparing", label: "Kitchen Preparing", icon: "fa-fire-burner", desc: "Chef is preparing your fresh meal" },
    { key: "Ready", label: "Ready for Pickup", icon: "fa-bell-concierge", desc: "Ready at your designated counter" },
    { key: "Completed", label: "Order Picked Up", icon: "fa-circle-check", desc: "Handed over to student" }
  ];

  // Fetch target order on mount
  React.useEffect(() => {
    async function fetchOrder() {
      setLoading(true);
      const urlParams = new URLSearchParams(window.location.search);
      const requestedId = urlParams.get("orderId");

      const res = await API.getOrders();
      if (res.success && res.data.length > 0) {
        let matched = null;
        if (requestedId) {
          matched = res.data.find((o) => o.orderId.toUpperCase() === requestedId.toUpperCase());
        }
        if (!matched) {
          // Default to most recent order
          matched = res.data[0];
        }
        setOrder(matched);
      }
      setLoading(false);
    }
    fetchOrder();
  }, []);

  // Countdown timer simulation for prep time
  React.useEffect(() => {
    if (!order || order.orderStatus === "Completed" || order.orderStatus === "Cancelled") return;
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [order]);

  const formatCountdown = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // Search specific Order ID
  const handleSearchOrder = async (e) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    setLoading(true);
    const res = await API.getOrderById(searchId.trim());
    setLoading(false);
    if (res.success) {
      setOrder(res.data);
      Utils.showToast(`Found Order ${res.data.orderId}`, "success");
    } else {
      Utils.showToast("No order found with this ID", "error");
    }
  };

  // Fast-forward demo button to test next stage
  const handleAdvanceStatusDemo = async () => {
    if (!order) return;
    const orderProgression = ["Pending", "Confirmed", "Preparing", "Ready", "Completed"];
    const currentIdx = orderProgression.indexOf(order.orderStatus);
    const nextIdx = (currentIdx + 1) % orderProgression.length;
    const nextStatus = orderProgression[nextIdx];

    const res = await API.updateOrderStatus(order.orderId, nextStatus);
    if (res.success) {
      setOrder({ ...res.data });
      Utils.showToast(`Status advanced to: ${nextStatus} 🚀`, "info");
    }
  };

  // Determine stage progress
  const getStageIndex = (status) => {
    switch (status) {
      case "Pending": return 0;
      case "Confirmed": return 1;
      case "Preparing": return 2;
      case "Ready": return 3;
      case "Completed": return 4;
      default: return 0;
    }
  };

  if (loading) {
    return (
      <div className="tracking-loading">
        <i className="fa-solid fa-satellite-dish fa-spin fa-2x text-primary"></i>
        <p>Connecting to kitchen dispatch...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="tracking-empty">
        <i className="fa-solid fa-receipt empty-icon"></i>
        <h2>No Active Orders to Track</h2>
        <p>You haven't placed an order yet or the order ID was not found.</p>
        <a href="menu.html" className="btn btn-primary">Browse Menu & Order</a>
      </div>
    );
  }

  const currentStageIndex = getStageIndex(order.orderStatus);
  const progressPercent = (currentStageIndex / (stages.length - 1)) * 100;

  return (
    <div className="order-tracker-card">
      {/* Search Bar for Other Orders */}
      <div className="tracker-search-row">
        <form onSubmit={handleSearchOrder} className="tracker-search-form">
          <input
            type="text"
            placeholder="Search by Order ID (e.g. CAN20260906001)"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value.toUpperCase())}
            className="form-control tracker-search-input"
          />
          <button type="submit" className="btn btn-secondary">
            <i className="fa-solid fa-magnifying-glass"></i> Track
          </button>
        </form>

        {/* Demo Fast-Forward Button for Evaluators */}
        <button
          className="btn btn-outline-primary btn-sm btn-demo-status"
          onClick={handleAdvanceStatusDemo}
          title="Simulate advancing to next order stage"
        >
          <i className="fa-solid fa-forward-step"></i> Advance Status Demo
        </button>
      </div>

      {/* Order Status Hero Header */}
      <div className="tracker-header-box">
        <div className="tracker-id-group">
          <span className="tracker-pill">Active Kitchen Order</span>
          <h2 className="tracker-order-id">{order.orderId}</h2>
          <div className="tracker-timestamp">
            <i className="fa-regular fa-clock"></i> Placed on {Utils.formatDate(order.orderTime)}
          </div>
        </div>

        {/* Large Pickup Token Display */}
        <div className="pickup-token-card">
          <span className="token-label">PICKUP TOKEN</span>
          <strong className="token-number">#{order.tokenNumber}</strong>
          <span className="token-counter"><i className="fa-solid fa-location-dot"></i> {order.pickupCounter}</span>
        </div>
      </div>

      {/* Estimated Prep Countdown */}
      {order.orderStatus !== "Completed" && (
        <div className="prep-countdown-banner">
          <div className="countdown-left">
            <div className="chef-icon-pulse">
              <i className="fa-solid fa-kitchen-set"></i>
            </div>
            <div>
              <h4>{order.orderStatus === "Ready" ? "Order is READY at the Counter!" : "Estimated Preparation Time"}</h4>
              <p>{order.orderStatus === "Ready" ? "Please show your token to collect your food." : "Freshly cooking to ensure authentic taste."}</p>
            </div>
          </div>
          {order.orderStatus !== "Ready" && (
            <div className="countdown-clock">
              <span className="clock-digits">{formatCountdown(countdown)}</span>
              <span className="clock-sub">MINUTES REMAINING</span>
            </div>
          )}
        </div>
      )}

      {/* 5-Stage Animated Tracking Timeline */}
      <div className="tracking-timeline-wrapper">
        <div className="tracking-timeline">
          <div
            className="timeline-progress-bar"
            style={{ width: `${progressPercent}%` }}
          ></div>

          {stages.map((stage, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isActive = idx === currentStageIndex;

            return (
              <div
                key={stage.key}
                className={`timeline-step ${isCompleted ? "completed" : ""} ${isActive ? "active" : ""}`}
              >
                <div className="timeline-icon-box">
                  <i className={`fa-solid ${stage.icon}`}></i>
                </div>
                <h4 className="timeline-step-title">{stage.label}</h4>
                <p className="timeline-step-time">{stage.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Item Details Accordion */}
      <div className="tracker-details-grid">
        <div className="tracker-detail-col">
          <h3 className="section-subheading"><i className="fa-solid fa-burger"></i> Ordered Food Items</h3>
          <div className="tracker-items-list">
            {order.items.map((item, idx) => (
              <div key={idx} className="tracker-food-row">
                <img src={item.image} alt={item.name} className="tracker-food-thumb" />
                <div className="tracker-food-info">
                  <strong>{item.name}</strong>
                  <span>Qty: {item.quantity} × ₹{item.price}</span>
                </div>
                <div className="tracker-food-price">₹{item.price * item.quantity}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="tracker-detail-col">
          <h3 className="section-subheading"><i className="fa-solid fa-receipt"></i> Payment & Delivery</h3>
          <div className="tracker-info-table">
            <div className="info-row">
              <span>Payment Method</span>
              <strong>{order.paymentMethod}</strong>
            </div>
            <div className="info-row">
              <span>Payment Status</span>
              <span className="badge-status status-ready">{order.paymentStatus}</span>
            </div>
            <div className="info-row">
              <span>Pickup Counter</span>
              <strong>{order.pickupCounter}</strong>
            </div>
            <div className="info-row">
              <span>Pickup Slot</span>
              <strong>{order.pickupSlot || "Immediate"}</strong>
            </div>
            <div className="info-row total-highlight">
              <span>Total Paid</span>
              <strong className="text-primary">₹{order.totalAmount}</strong>
            </div>
          </div>

          <div className="tracker-actions">
            <button className="btn btn-secondary btn-block" onClick={() => window.print()}>
              <i className="fa-solid fa-print"></i> Print Receipt Token
            </button>
            <a href="orders.html" className="btn btn-outline-primary btn-block">
              <i className="fa-solid fa-clock-rotate-left"></i> View All Orders
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// Expose component to window
window.OrderTracker = OrderTracker;
