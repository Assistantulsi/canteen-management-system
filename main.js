/**
 * CampusBite - Global Frontend Controller (main.js)
 * Manages theme switching, responsive navigation, cart badge counters,
 * notification badges, user account popups, and food details modal.
 */

document.addEventListener("DOMContentLoaded", () => {
  App.init();
});

const App = {
  init() {
    this.initTheme();
    this.updateCartBadges();
    this.updateNotificationBadges();
    this.renderUserNavState();
    this.initMobileNav();
    this.initFoodDetailModal();
    this.highlightActiveNav();

    // Listen for cross-component events
    window.addEventListener("campusbite_cart_updated", () => this.updateCartBadges());
    window.addEventListener("campusbite_notifications_updated", () => this.updateNotificationBadges());
  },

  // =========================================================================
  // Theme Switching (Dark / Light Mode)
  // =========================================================================
  initTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    this.updateThemeToggleIcons(savedTheme);

    document.querySelectorAll(".theme-toggle-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
        this.updateThemeToggleIcons(newTheme);
        Utils.showToast(`Switched to ${newTheme === "dark" ? "Dark 🌙" : "Light ☀️"} mode`, "info", 1500);
      });
    });
  },

  updateThemeToggleIcons(theme) {
    document.querySelectorAll(".theme-toggle-btn").forEach((btn) => {
      const icon = btn.querySelector("i");
      if (icon) {
        icon.className = theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
      }
    });
  },

  // =========================================================================
  // Badge Counters
  // =========================================================================
  updateCartBadges() {
    const cart = API.getCart();
    const count = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);

    document.querySelectorAll(".cart-count-badge").forEach((badge) => {
      badge.textContent = count;
      badge.style.display = count > 0 ? "inline-flex" : "none";
    });
  },

  updateNotificationBadges() {
    const notifs = API.getNotifications();
    const unread = notifs.filter((n) => !n.isRead).length;

    document.querySelectorAll(".notif-count-badge").forEach((badge) => {
      badge.textContent = unread;
      badge.style.display = unread > 0 ? "inline-flex" : "none";
    });
  },

  // =========================================================================
  // Dynamic User Navigation State (Logged In vs Guest)
  // =========================================================================
  renderUserNavState() {
    const user = API.getCurrentUser();
    const navAuthContainers = document.querySelectorAll(".nav-user-container");

    navAuthContainers.forEach((container) => {
      // Calculate relative prefix
      const isPagesDir = window.location.pathname.includes("/pages/");
      const isHome = !isPagesDir && !window.location.pathname.includes("/admin/");
      const prefix = isPagesDir ? "" : "pages/";
      const rootPrefix = isPagesDir ? "../" : "";

      if (user) {
        container.innerHTML = `
          <div class="user-dropdown-wrapper">
            <button class="user-nav-btn" id="user-menu-trigger" aria-haspopup="true">
              <img src="${user.avatar}" alt="${user.name}" class="user-nav-avatar">
              <span class="user-nav-name">${user.name.split(" ")[0]}</span>
              <span class="user-nav-badge">₹${Number(user.walletBalance).toFixed(0)}</span>
              <i class="fa-solid fa-chevron-down nav-arrow"></i>
            </button>
            <div class="user-dropdown-menu" id="user-dropdown">
              <div class="dropdown-header">
                <div class="user-info">
                  <strong>${user.name}</strong>
                  <small>${user.id} • ${user.department.split(" ")[0]}</small>
                </div>
                <div class="wallet-pill">
                  <span>Wallet:</span>
                  <strong>₹${Number(user.walletBalance).toFixed(2)}</strong>
                </div>
              </div>
              <div class="dropdown-divider"></div>
              <a href="${prefix}dashboard.html" class="dropdown-item">
                <i class="fa-solid fa-gauge-high"></i> Student Dashboard
              </a>
              <a href="${prefix}orders.html" class="dropdown-item">
                <i class="fa-solid fa-receipt"></i> My Orders
              </a>
              <a href="${prefix}tracking.html" class="dropdown-item">
                <i class="fa-solid fa-satellite-dish"></i> Live Order Tracking
              </a>
              <a href="${prefix}wallet.html" class="dropdown-item">
                <i class="fa-solid fa-wallet"></i> Campus Wallet
              </a>
              <a href="${prefix}favorites.html" class="dropdown-item">
                <i class="fa-solid fa-heart"></i> Favorite Foods
              </a>
              <a href="${prefix}profile.html" class="dropdown-item">
                <i class="fa-solid fa-user-gear"></i> Profile & Settings
              </a>
              <div class="dropdown-divider"></div>
              <button class="dropdown-item text-danger" id="nav-logout-btn">
                <i class="fa-solid fa-arrow-right-from-bracket"></i> Logout
              </button>
            </div>
          </div>
        `;

        // Bind dropdown toggling
        const trigger = container.querySelector("#user-menu-trigger");
        const dropdown = container.querySelector("#user-dropdown");
        if (trigger && dropdown) {
          trigger.addEventListener("click", (e) => {
            e.stopPropagation();
            dropdown.classList.toggle("show");
          });

          document.addEventListener("click", () => {
            dropdown.classList.remove("show");
          });
        }

        // Bind logout
        const logoutBtn = container.querySelector("#nav-logout-btn");
        if (logoutBtn) {
          logoutBtn.addEventListener("click", () => Auth.logoutStudent());
        }
      } else {
        const loginUrl = rootPrefix + "login.html";
        const registerUrl = rootPrefix + "register.html";
        container.innerHTML = `
          <div class="auth-btn-group">
            <a href="${loginUrl}" class="btn btn-outline-primary btn-sm">
              <i class="fa-solid fa-right-to-bracket"></i> Login
            </a>
            <a href="${registerUrl}" class="btn btn-primary btn-sm">
              <i class="fa-solid fa-user-plus"></i> Sign Up
            </a>
          </div>
        `;
      }
    });
  },

  // =========================================================================
  // Mobile Navigation Drawer (Hamburger Menu)
  // =========================================================================
  initMobileNav() {
    const hamburger = document.querySelector(".hamburger-btn");
    const mobileDrawer = document.querySelector(".mobile-drawer");
    const backdrop = document.querySelector(".drawer-backdrop");
    const closeBtn = document.querySelector(".drawer-close-btn");

    if (hamburger && mobileDrawer) {
      const openDrawer = () => {
        mobileDrawer.classList.add("open");
        if (backdrop) backdrop.classList.add("show");
        document.body.style.overflow = "hidden";
      };

      const closeDrawer = () => {
        mobileDrawer.classList.remove("open");
        if (backdrop) backdrop.classList.remove("show");
        document.body.style.overflow = "";
      };

      hamburger.addEventListener("click", openDrawer);
      if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
      if (backdrop) backdrop.addEventListener("click", closeDrawer);

      mobileDrawer.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeDrawer);
      });
    }
  },

  // =========================================================================
  // Highlight Active Page in Navigation
  // =========================================================================
  highlightActiveNav() {
    const currentPath = window.location.pathname;
    document.querySelectorAll(".nav-link, .sidebar-link").forEach((link) => {
      const href = link.getAttribute("href");
      if (href && (currentPath.endsWith(href) || (currentPath.endsWith("/") && href.includes("index.html")))) {
        link.classList.add("active");
      }
    });
  },

  // =========================================================================
  // Global Food Details Modal
  // =========================================================================
  initFoodDetailModal() {
    // Inject modal container if not already in document
    if (!document.getElementById("food-details-modal")) {
      const modalHtml = `
        <div id="food-details-modal" class="modal-backdrop" aria-hidden="true">
          <div class="modal-dialog modal-food-detail animate-scale-in" role="dialog" aria-modal="true">
            <button class="modal-close-btn" id="food-modal-close" aria-label="Close">&times;</button>
            <div class="modal-body" id="food-modal-body">
              <!-- Dynamically populated -->
            </div>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML("beforeend", modalHtml);

      const modal = document.getElementById("food-details-modal");
      const closeBtn = document.getElementById("food-modal-close");

      const closeModal = () => {
        modal.classList.remove("show");
        document.body.style.overflow = "";
      };

      closeBtn.addEventListener("click", closeModal);
      modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("show")) closeModal();
      });
    }

    // Attach click listeners to any food card detail triggers
    document.addEventListener("click", async (e) => {
      const trigger = e.target.closest("[data-food-detail-id]");
      if (trigger) {
        const foodId = trigger.getAttribute("data-food-detail-id");
        if (foodId) {
          e.preventDefault();
          App.openFoodDetails(foodId);
        }
      }
    });
  },

  async openFoodDetails(foodId) {
    const modal = document.getElementById("food-details-modal");
    const modalBody = document.getElementById("food-modal-body");
    if (!modal || !modalBody) return;

    modalBody.innerHTML = `
      <div class="modal-loading">
        <i class="fa-solid fa-circle-notch fa-spin"></i>
        <span>Loading delicious details...</span>
      </div>
    `;
    modal.classList.add("show");
    document.body.style.overflow = "hidden";

    const res = await API.getFoodById(foodId);
    if (!res.success) {
      modalBody.innerHTML = `<div class="p-4 text-center">Food details unavailable.</div>`;
      return;
    }

    const food = res.data;
    const favorites = API.getFavorites();
    const isFav = favorites.includes(food.id);

    modalBody.innerHTML = `
      <div class="food-modal-grid">
        <div class="food-modal-media">
          <img src="${food.image}" alt="${food.name}" class="food-modal-img">
          <div class="food-modal-badges">
            <span class="diet-tag ${food.isVeg ? "diet-veg" : "diet-nonveg"}">
              <i class="fa-solid fa-circle"></i> ${food.isVeg ? "100% Pure Veg" : "Non-Veg"}
            </span>
            <span class="badge-prep"><i class="fa-regular fa-clock"></i> ${food.prepTime}</span>
          </div>
        </div>
        <div class="food-modal-content">
          <div class="food-modal-header">
            <div>
              <span class="food-category-pill">${food.category}</span>
              <h2 class="food-modal-title">${food.name}</h2>
            </div>
            <button class="btn-fav-toggle ${isFav ? "active" : ""}" id="modal-fav-btn" title="Add to Favorites">
              <i class="${isFav ? "fa-solid" : "fa-regular"} fa-heart"></i>
            </button>
          </div>

          <div class="food-modal-rating">
            <span class="rating-stars">
              <i class="fa-solid fa-star"></i>
              <strong>${food.rating}</strong>
            </span>
            <span class="text-muted">(${food.ratingCount} student ratings)</span>
            <span class="calorie-tag"><i class="fa-solid fa-fire"></i> ${food.calories || 320} kcal</span>
          </div>

          <p class="food-modal-desc">${food.description}</p>

          <div class="food-ingredients-section">
            <h4><i class="fa-solid fa-mortar-pestle"></i> Fresh Ingredients</h4>
            <div class="ingredient-chips">
              ${(food.ingredients || ["Fresh herbs", "Spices", "Refined batter"]).map((ing) => `<span class="chip">${ing}</span>`).join("")}
            </div>
          </div>

          <div class="special-notes-box">
            <label for="modal-special-notes"><i class="fa-regular fa-comment-dots"></i> Cooking Instructions (Optional)</label>
            <input type="text" id="modal-special-notes" class="form-control" placeholder="e.g., Less spicy, extra sauce, well toasted">
          </div>

          <div class="food-modal-footer">
            <div class="price-container">
              <span class="price-label">Price</span>
              <span class="food-price-large">₹${food.price}</span>
            </div>

            <div class="modal-actions">
              <div class="quantity-stepper">
                <button type="button" class="btn-step" id="modal-qty-minus"><i class="fa-solid fa-minus"></i></button>
                <span class="qty-display" id="modal-qty-val">1</span>
                <button type="button" class="btn-step" id="modal-qty-plus"><i class="fa-solid fa-plus"></i></button>
              </div>
              <button class="btn btn-primary btn-lg" id="modal-add-cart-btn" ${!food.isAvailable ? "disabled" : ""}>
                <i class="fa-solid fa-cart-plus"></i> ${food.isAvailable ? "Add to Cart" : "Currently Sold Out"}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Bind quantity stepper
    let qty = 1;
    const qtyVal = modalBody.querySelector("#modal-qty-val");
    modalBody.querySelector("#modal-qty-plus").addEventListener("click", () => {
      qty++;
      qtyVal.textContent = qty;
    });
    modalBody.querySelector("#modal-qty-minus").addEventListener("click", () => {
      if (qty > 1) {
        qty--;
        qtyVal.textContent = qty;
      }
    });

    // Bind favorite toggle
    const favBtn = modalBody.querySelector("#modal-fav-btn");
    favBtn.addEventListener("click", () => {
      const res = API.toggleFavorite(food.id);
      favBtn.classList.toggle("active", res.isFavorite);
      const icon = favBtn.querySelector("i");
      icon.className = res.isFavorite ? "fa-solid fa-heart" : "fa-regular fa-heart";
      Utils.showToast(res.isFavorite ? `Added ${food.name} to Favorites ❤️` : `Removed from Favorites`, "info", 1800);
    });

    // Bind Add to Cart
    const addBtn = modalBody.querySelector("#modal-add-cart-btn");
    addBtn.addEventListener("click", () => {
      if (!food.isAvailable) return;
      API.addToCart(food, qty);
      Utils.showToast(`Added ${qty}x ${food.name} to your cart! 🛒`, "success", 2500);
      modal.classList.remove("show");
      document.body.style.overflow = "";
    });
  }
};

// Expose globally
if (typeof window !== "undefined") {
  window.App = App;
}
