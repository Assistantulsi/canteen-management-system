/**
 * CampusBite - React MenuApp Component
 * Dynamic Digital Canteen Menu with real-time search, category filtering,
 * dietary preferences (Veg/Non-Veg), sorting, favorites, and cart management.
 */

function MenuApp() {
  const [foods, setFoods] = React.useState([]);
  const [categories, setCategories] = React.useState(["All", "Breakfast", "Snacks", "Meals", "Fast Food", "Beverages", "Desserts"]);
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [dietFilter, setDietFilter] = React.useState("all"); // all | veg | nonveg
  const [sortBy, setSortBy] = React.useState("popular"); // popular | price-asc | price-desc | rating
  const [availableOnly, setAvailableOnly] = React.useState(false);
  const [cart, setCart] = React.useState([]);
  const [favorites, setFavorites] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  // Load menu data & synchronize cart & favorites
  React.useEffect(() => {
    async function loadData() {
      setLoading(true);
      const res = await API.getMenu();
      if (res.success) {
        setFoods(res.data);
      }
      setCart(API.getCart());
      setFavorites(API.getFavorites());
      setLoading(false);
    }
    loadData();

    // Listen to external cart/fav updates
    const handleCartSync = (e) => setCart(e.detail || API.getCart());
    const handleFavSync = (e) => setFavorites(e.detail || API.getFavorites());
    window.addEventListener("campusbite_cart_updated", handleCartSync);
    window.addEventListener("campusbite_favorites_updated", handleFavSync);

    return () => {
      window.removeEventListener("campusbite_cart_updated", handleCartSync);
      window.removeEventListener("campusbite_favorites_updated", handleFavSync);
    };
  }, []);

  // Filter & sort foods
  const filteredFoods = React.useMemo(() => {
    return foods
      .filter((food) => {
        // Category filter
        if (selectedCategory !== "All" && food.category !== selectedCategory) return false;
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = food.name.toLowerCase().includes(q);
          const matchDesc = food.description.toLowerCase().includes(q);
          const matchCat = food.category.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchCat) return false;
        }
        // Dietary preference
        if (dietFilter === "veg" && !food.isVeg) return false;
        if (dietFilter === "nonveg" && food.isVeg) return false;
        // Availability
        if (availableOnly && !food.isAvailable) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        return b.ratingCount - a.ratingCount; // default popularity
      });
  }, [foods, selectedCategory, searchQuery, dietFilter, sortBy, availableOnly]);

  // Handlers
  const handleAddToCart = (food, e) => {
    e.stopPropagation();
    if (!food.isAvailable) return;
    const updated = API.addToCart(food, 1);
    setCart([...updated]);
    Utils.showToast(`Added ${food.name} to Cart 🛒`, "success", 1800);
  };

  const handleUpdateQty = (foodId, delta, e) => {
    e.stopPropagation();
    const item = cart.find((c) => c.foodId === foodId);
    if (!item) return;
    const newQty = item.quantity + delta;
    const updated = API.updateCartQuantity(foodId, newQty);
    setCart([...updated]);
  };

  const handleToggleFavorite = (foodId, e) => {
    e.stopPropagation();
    const res = API.toggleFavorite(foodId);
    setFavorites([...res.favorites]);
    Utils.showToast(res.isFavorite ? "Added to Favorites ❤️" : "Removed from Favorites", "info", 1500);
  };

  const getCartItemQty = (foodId) => {
    const item = cart.find((c) => c.foodId === foodId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="react-menu-container">
      {/* Search & Filter Bar Controls */}
      <div className="menu-filter-bar">
        {/* Search Input */}
        <div className="menu-search-wrapper">
          <i className="fa-solid fa-magnifying-glass search-icon"></i>
          <input
            type="text"
            className="menu-search-input"
            placeholder="Search favorite snacks, dosa, burgers, chai..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery("")}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>

        {/* Secondary Filter Controls */}
        <div className="filter-controls-row">
          {/* Dietary Radios */}
          <div className="diet-filter-pills">
            <button
              className={`diet-pill ${dietFilter === "all" ? "active" : ""}`}
              onClick={() => setDietFilter("all")}
            >
              All Items
            </button>
            <button
              className={`diet-pill diet-pill-veg ${dietFilter === "veg" ? "active" : ""}`}
              onClick={() => setDietFilter("veg")}
            >
              <i className="fa-solid fa-circle text-emerald"></i> Veg Only
            </button>
            <button
              className={`diet-pill diet-pill-nonveg ${dietFilter === "nonveg" ? "active" : ""}`}
              onClick={() => setDietFilter("nonveg")}
            >
              <i className="fa-solid fa-circle text-ruby"></i> Non-Veg
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="sort-dropdown-wrapper">
            <label htmlFor="menu-sort-select"><i className="fa-solid fa-arrow-down-short-wide"></i> Sort:</label>
            <select
              id="menu-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Top Rated ⭐</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          {/* In-Stock Filter Toggle */}
          <label className="stock-toggle-label">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
            />
            <span>In Stock Only</span>
          </label>
        </div>

        {/* Category Chips Bar */}
        <div className="category-chips-scroll">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-chip ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === "All" && <i className="fa-solid fa-utensils"></i>}
              {cat === "Breakfast" && <i className="fa-solid fa-bread-slice"></i>}
              {cat === "Snacks" && <i className="fa-solid fa-cookie"></i>}
              {cat === "Meals" && <i className="fa-solid fa-bowl-rice"></i>}
              {cat === "Fast Food" && <i className="fa-solid fa-burger"></i>}
              {cat === "Beverages" && <i className="fa-solid fa-mug-hot"></i>}
              {cat === "Desserts" && <i className="fa-solid fa-ice-cream"></i>}
              <span>{cat}</span>
              <span className="chip-count">
                {cat === "All" ? foods.length : foods.filter((f) => f.category === cat).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Menu Results Count & Meta */}
      <div className="menu-results-header">
        <p className="results-count-text">
          Showing <strong>{filteredFoods.length}</strong> items in <em>{selectedCategory}</em>
        </p>
      </div>

      {/* Food Items Cards Grid */}
      {loading ? (
        <div className="menu-loading-state">
          <i className="fa-solid fa-circle-notch fa-spin fa-2x"></i>
          <p>Loading fresh kitchen menu...</p>
        </div>
      ) : filteredFoods.length === 0 ? (
        <div className="menu-empty-state">
          <i className="fa-solid fa-utensils-slash empty-icon"></i>
          <h3>No matching food items found</h3>
          <p>Try searching for a different item or clear your dietary filters.</p>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
              setDietFilter("all");
              setAvailableOnly(false);
            }}
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="food-grid">
          {filteredFoods.map((food) => {
            const qty = getCartItemQty(food.id);
            const isFav = favorites.includes(food.id);

            return (
              <div
                key={food.id}
                className={`food-card ${!food.isAvailable ? "food-unavailable" : ""}`}
                onClick={() => App.openFoodDetails(food.id)}
              >
                <div className="food-card-img-wrapper">
                  <img src={food.image} alt={food.name} className="food-card-img" loading="lazy" />

                  {/* Top Badges */}
                  <div className="card-top-badges">
                    <span className={`diet-tag ${food.isVeg ? "diet-veg" : "diet-nonveg"}`}>
                      <i className="fa-solid fa-circle"></i> {food.isVeg ? "Veg" : "Non-Veg"}
                    </span>
                    <button
                      className={`btn-fav-card ${isFav ? "active" : ""}`}
                      onClick={(e) => handleToggleFavorite(food.id, e)}
                      title={isFav ? "Remove from Favorites" : "Add to Favorites"}
                    >
                      <i className={`${isFav ? "fa-solid" : "fa-regular"} fa-heart`}></i>
                    </button>
                  </div>

                  {/* Prep Time */}
                  <span className="card-prep-time">
                    <i className="fa-regular fa-clock"></i> {food.prepTime}
                  </span>

                  {!food.isAvailable && (
                    <div className="sold-out-overlay">
                      <span>Sold Out</span>
                    </div>
                  )}
                </div>

                <div className="food-card-body">
                  <div className="food-card-meta">
                    <span className="food-category-label">{food.category}</span>
                    <div className="food-card-rating">
                      <i className="fa-solid fa-star"></i>
                      <span>{food.rating}</span>
                      <small className="text-muted">({food.ratingCount})</small>
                    </div>
                  </div>

                  <h3 className="food-card-title">{food.name}</h3>
                  <p className="food-card-desc">{food.description}</p>

                  <div className="food-card-footer">
                    <div className="food-price">₹{food.price}</div>

                    {qty > 0 ? (
                      <div className="quantity-stepper" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          className="btn-step"
                          onClick={(e) => handleUpdateQty(food.id, -1, e)}
                        >
                          <i className="fa-solid fa-minus"></i>
                        </button>
                        <span className="qty-display">{qty}</span>
                        <button
                          type="button"
                          className="btn-step"
                          onClick={(e) => handleUpdateQty(food.id, 1, e)}
                        >
                          <i className="fa-solid fa-plus"></i>
                        </button>
                      </div>
                    ) : (
                      <button
                        className="btn btn-primary btn-sm"
                        disabled={!food.isAvailable}
                        onClick={(e) => handleAddToCart(food, e)}
                      >
                        <i className="fa-solid fa-cart-plus"></i>
                        <span>{food.isAvailable ? "Add" : "Unavailable"}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Expose component to window
window.MenuApp = MenuApp;
