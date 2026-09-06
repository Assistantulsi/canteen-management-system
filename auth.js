/**
 * CampusBite - Authentication & Session Guard
 * Manages user & admin login states, route protection, and auth UI helpers.
 * 
 * NOTE FOR BACKEND INTEGRATION:
 * In a production backend, replace localStorage auth checks with JWT tokens
 * stored in HTTP-only secure cookies or Authorization Bearer headers.
 */

const Auth = {
  // Check if student user is logged in
  isStudentLoggedIn() {
    return API.getCurrentUser() !== null;
  },

  // Check if admin is logged in
  isAdminLoggedIn() {
    return API.getAdminSession() !== null;
  },

  // Route guard for protected student pages (dashboard, checkout, orders, wallet, profile, tracking)
  requireStudentAuth(redirectPath = "../login.html") {
    if (!this.isStudentLoggedIn()) {
      sessionStorage.setItem("campusbite_redirect_after_login", window.location.href);
      Utils.showToast("Please log in to access your student account.", "warning");
      setTimeout(() => {
        window.location.href = redirectPath;
      }, 700);
      return false;
    }
    return true;
  },

  // Route guard for admin pages
  requireAdminAuth(redirectPath = "../admin-login.html") {
    if (!this.isAdminLoggedIn()) {
      Utils.showToast("Admin authentication required.", "error");
      setTimeout(() => {
        window.location.href = redirectPath;
      }, 700);
      return false;
    }
    return true;
  },

  // Handle student logout with clean redirect
  logoutStudent() {
    API.logoutUser();
    Utils.showToast("Logged out successfully.", "info");
    setTimeout(() => {
      // Determine relative path based on current location
      const isPagesDir = window.location.pathname.includes("/pages/");
      window.location.href = isPagesDir ? "../index.html" : "index.html";
    }, 600);
  },

  // Handle admin logout
  logoutAdmin() {
    API.logoutAdmin();
    Utils.showToast("Admin logged out.", "info");
    setTimeout(() => {
      const isAdminDir = window.location.pathname.includes("/admin/");
      window.location.href = isAdminDir ? "../admin-login.html" : "admin-login.html";
    }, 600);
  },

  // Setup password show/hide toggle buttons
  setupPasswordToggles() {
    document.querySelectorAll(".password-toggle").forEach((btn) => {
      btn.addEventListener("click", () => {
        const input = btn.parentElement.querySelector("input");
        if (!input) return;
        const isPassword = input.type === "password";
        input.type = isPassword ? "text" : "password";
        const icon = btn.querySelector("i");
        if (icon) {
          icon.className = isPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye";
        }
      });
    });
  },

  // Fill sample credentials helper button
  fillCredentials(email, password, formSelector = "#login-form") {
    const form = document.querySelector(formSelector);
    if (!form) return;
    const identifierInput = form.querySelector('input[type="email"], input[name="identifier"], input[id*="email"], input[id*="id"]');
    const passwordInput = form.querySelector('input[type="password"]');
    if (identifierInput) identifierInput.value = email;
    if (passwordInput) passwordInput.value = password;
    Utils.showToast("Sample credentials auto-filled!", "info", 1800);
  }
};

// Expose globally
if (typeof window !== "undefined") {
  window.Auth = Auth;
}
