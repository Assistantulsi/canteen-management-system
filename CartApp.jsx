/**
 * CampusBite - React CartApp Component
 * Dynamic Shopping Cart with item quantity increments, subtotal calculations,
 * interactive promo coupons, packaging breakdown, and checkout transition.
 */

function CartApp() {
  const [cart, setCart] = React.useState([]);
  const [couponCode, setCouponCode] = React.useState("");
  const [appliedCoupon, setAppliedCoupon] = React.useState(null);
  const [couponLoading, setCouponLoading] = React.useState(false);
  const [couponError, setCouponError] = React.useState("");

  // Sync cart from API
  React.useEffect(() => {
    setCart(API.getCart());

    const handleCartSync = (e) => setCart(e.detail || API.getCart());
    window.addEventListener("campusbite_cart_updated", handleCartSync);
    return () => window.removeEventListener("campusbite_cart_updated", handleCartSync);
  }, []);

  // Update item quantity
  const handleUpdateQty = (foodId, delta) => {
    const item = cart.find((i) => i.foodId === foodId);
    if (!item) return;
    const newQty = item.quantity + delta;
    const updated = API.updateCartQuantity(foodId, newQty);
    setCart([...updated]);
  };

  // Remove item from cart
  const handleRemoveItem = (foodId, name) => {
    const updated = API.removeFromCart(foodId);
    setCart([...updated]);
    Utils.showToast(`Removed ${name} from cart`, "info", 1800);
  };

  // Clear entire cart
  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your shopping cart?")) {
      const updated = API.clearCart();
      setCart([...updated]);
      setAppliedCoupon(null);
      Utils.showToast("Cart cleared", "info", 1500);
    }
  };

  // Calculations
  const subtotal = React.useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const packagingFee = subtotal > 0 ? 5 : 0; // Nominal college eco-container fee
  const grandTotal = Math.max(0, subtotal - discountAmount + packagingFee);

  // Apply Coupon handler
  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError("");

    const res = await API.validateCoupon(couponCode, subtotal);
    setCouponLoading(false);

    if (res.success) {
      setAppliedCoupon(res.data);
      Utils.showToast(res.message, "success");
    } else {
      setCouponError(res.message);
      Utils.showToast(res.message, "error");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
    Utils.showToast("Coupon removed", "info", 1200);
  };

  const handleProceedCheckout = () => {
    // Save current active coupon info to sessionStorage for checkout page
    if (appliedCoupon) {
      sessionStorage.setItem("campusbite_active_coupon", JSON.stringify(appliedCoupon));
    } else {
      sessionStorage.removeItem("campusbite_active_coupon");
    }
    window.location.href = "checkout.html";
  };

  if (cart.length === 0) {
    return (
      <div className="cart-empty-container">
        <div className="cart-empty-graphic">
          <i className="fa-solid fa-cart-shopping"></i>
        </div>
        <h2>Your Canteen Cart is Empty!</h2>
        <p>Looks like you haven't selected any snacks or meals yet. Explore our fresh campus menu.</p>
        <a href="menu.html" className="btn btn-primary btn-lg">
          <i className="fa-solid fa-utensils"></i> Browse Delicious Menu
        </a>
      </div>
    );
  }

  return (
    <div className="cart-page-grid">
      {/* Items List Column */}
      <div className="cart-items-column">
        <div className="cart-section-header">
          <h2>Order Items ({cart.reduce((sum, i) => sum + i.quantity, 0)})</h2>
          <button className="btn-clear-cart" onClick={handleClearCart}>
            <i className="fa-regular fa-trash-can"></i> Clear Cart
          </button>
        </div>

        <div className="cart-items-list">
          {cart.map((item) => (
            <div key={item.foodId} className="cart-item-card">
              <img src={item.image} alt={item.name} className="cart-item-img" />

              <div className="cart-item-details">
                <div className="cart-item-title-row">
                  <span className={`diet-tag ${item.isVeg ? "diet-veg" : "diet-nonveg"}`}>
                    <i className="fa-solid fa-circle"></i>
                  </span>
                  <h3 className="cart-item-name">{item.name}</h3>
                </div>
                <div className="cart-item-price-each">₹{item.price} each</div>
              </div>

              {/* Quantity Stepper */}
              <div className="cart-item-stepper">
                <button
                  type="button"
                  className="btn-step"
                  onClick={() => handleUpdateQty(item.foodId, -1)}
                >
                  <i className="fa-solid fa-minus"></i>
                </button>
                <span className="qty-display">{item.quantity}</span>
                <button
                  type="button"
                  className="btn-step"
                  onClick={() => handleUpdateQty(item.foodId, 1)}
                >
                  <i className="fa-solid fa-plus"></i>
                </button>
              </div>

              {/* Item Total */}
              <div className="cart-item-total">
                ₹{item.price * item.quantity}
              </div>

              {/* Remove Button */}
              <button
                className="cart-item-remove-btn"
                onClick={() => handleRemoveItem(item.foodId, item.name)}
                title="Remove Item"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          ))}
        </div>

        {/* Quick Promo Suggestion Chips */}
        <div className="promo-suggestions-box">
          <span><i className="fa-solid fa-tags"></i> Available Coupons:</span>
          <div className="promo-tags-row">
            <button
              className="promo-chip"
              onClick={() => { setCouponCode("CANTEEN20"); }}
            >
              CANTEEN20 (20% OFF)
            </button>
            <button
              className="promo-chip"
              onClick={() => { setCouponCode("WELCOME50"); }}
            >
              WELCOME50 (₹50 OFF)
            </button>
            <button
              className="promo-chip"
              onClick={() => { setCouponCode("CAMPUS10"); }}
            >
              CAMPUS10 (10% OFF)
            </button>
          </div>
        </div>
      </div>

      {/* Order Summary Column */}
      <div className="cart-summary-column">
        <div className="cart-summary-card">
          <h3 className="summary-title">Order Summary</h3>

          {/* Coupon Code Input */}
          <div className="coupon-form-wrapper">
            <form onSubmit={handleApplyCoupon} className="coupon-input-group">
              <input
                type="text"
                placeholder="Enter Coupon Code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="form-control coupon-input"
              />
              <button
                type="submit"
                className="btn btn-secondary btn-apply"
                disabled={couponLoading || !couponCode.trim()}
              >
                {couponLoading ? <i className="fa-solid fa-spinner fa-spin"></i> : "Apply"}
              </button>
            </form>

            {couponError && <div className="coupon-error-msg">{couponError}</div>}

            {appliedCoupon && (
              <div className="coupon-applied-badge">
                <div className="coupon-info">
                  <i className="fa-solid fa-circle-check text-emerald"></i>
                  <span><strong>{appliedCoupon.code}</strong> applied (-₹{appliedCoupon.discount})</span>
                </div>
                <button className="remove-coupon-btn" onClick={handleRemoveCoupon}>
                  &times;
                </button>
              </div>
            )}
          </div>

          {/* Pricing Breakdown Rows */}
          <div className="summary-rows">
            <div className="summary-row">
              <span>Items Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            {appliedCoupon && (
              <div className="summary-row text-emerald">
                <span>Coupon Discount ({appliedCoupon.code})</span>
                <span>-₹{appliedCoupon.discount}</span>
              </div>
            )}

            <div className="summary-row">
              <span>Eco Packaging & Tray Fee</span>
              <span>₹{packagingFee}</span>
            </div>

            <div className="summary-row">
              <span>Campus Service GST</span>
              <span className="text-emerald">₹0 (Student Waived)</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row summary-grand-total">
              <span>Grand Total</span>
              <span>₹{grandTotal}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="summary-actions">
            <button
              className="btn btn-primary btn-lg btn-block"
              onClick={handleProceedCheckout}
            >
              <span>Proceed to Checkout</span>
              <i className="fa-solid fa-arrow-right"></i>
            </button>
            <a href="menu.html" className="btn btn-secondary btn-block">
              <i className="fa-solid fa-plus"></i> Add More Food
            </a>
          </div>

          {/* Trust Guarantees */}
          <div className="summary-perks">
            <div className="perk-item">
              <i className="fa-solid fa-bolt text-primary"></i>
              <span>Average pickup in 8-12 minutes</span>
            </div>
            <div className="perk-item">
              <i className="fa-solid fa-shield-halved text-emerald"></i>
              <span>100% Hygienic FSSAI Standard Campus Kitchen</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Expose component to window
window.CartApp = CartApp;
