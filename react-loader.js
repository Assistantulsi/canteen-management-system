/**
 * CampusBite - React Components Mounting Loader
 * Mounts modular React components into their corresponding page DOM targets.
 * Works seamlessly with React 18 createRoot.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Give Babel a short tick if scripts are compiling
  setTimeout(() => {
    initReactMounts();
  }, 100);
});

function initReactMounts() {
  if (typeof React === "undefined" || typeof ReactDOM === "undefined") {
    console.warn("React/ReactDOM not detected on this page. If dynamic components are needed, include React CDN.");
    return;
  }

  // 1. Mount Digital Menu App
  const menuContainer = document.getElementById("react-menu-root");
  if (menuContainer && typeof MenuApp !== "undefined") {
    const root = ReactDOM.createRoot(menuContainer);
    root.render(React.createElement(MenuApp));
  }

  // 2. Mount Shopping Cart App
  const cartContainer = document.getElementById("react-cart-root");
  if (cartContainer && typeof CartApp !== "undefined") {
    const root = ReactDOM.createRoot(cartContainer);
    root.render(React.createElement(CartApp));
  }

  // 3. Mount Order Tracking App
  const trackerContainer = document.getElementById("react-order-tracker-root");
  if (trackerContainer && typeof OrderTracker !== "undefined") {
    const root = ReactDOM.createRoot(trackerContainer);
    root.render(React.createElement(OrderTracker));
  }

  // 4. Mount Student Dashboard Widgets
  const dashboardContainer = document.getElementById("react-dashboard-widgets-root");
  if (dashboardContainer && typeof DashboardWidgets !== "undefined") {
    const root = ReactDOM.createRoot(dashboardContainer);
    root.render(React.createElement(DashboardWidgets));
  }

  // 5. Mount Admin Orders Live Board
  const adminOrdersContainer = document.getElementById("react-admin-orders-root");
  if (adminOrdersContainer && typeof AdminOrderBoard !== "undefined") {
    const root = ReactDOM.createRoot(adminOrdersContainer);
    root.render(React.createElement(AdminOrderBoard));
  }
}
