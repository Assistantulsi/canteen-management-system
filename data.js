/**
 * CampusBite - Initial Seed Data
 * Provides realistic sample data for college canteen operations.
 * Stored into LocalStorage on first launch if not already present.
 */

const INITIAL_DATA = {
  // 24 realistic college canteen food items across 6 categories
  foods: [
    {
      id: "FOOD_001",
      name: "Masala Dosa",
      category: "Breakfast",
      description: "Crispy golden fermented crepe stuffed with spiced potato mash, served with coconut chutney and hot sambar.",
      price: 50,
      image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80",
      ingredients: ["Rice batter", "Potato masala", "Mustard seeds", "Curry leaves", "Coconut chutney", "Sambar"],
      prepTime: "8 mins",
      isVeg: true,
      rating: 4.8,
      ratingCount: 342,
      isAvailable: true,
      isSpecial: true,
      calories: 310
    },
    {
      id: "FOOD_002",
      name: "Aloo Paratha with Curd",
      category: "Breakfast",
      description: "Whole wheat flatbread stuffed with spiced mashed potatoes, griddled with butter, served with fresh curd and pickle.",
      price: 60,
      image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=600&q=80",
      ingredients: ["Whole wheat flour", "Potatoes", "Green chilies", "Amchur", "Butter", "Curd", "Pickle"],
      prepTime: "10 mins",
      isVeg: true,
      rating: 4.7,
      ratingCount: 289,
      isAvailable: true,
      isSpecial: false,
      calories: 380
    },
    {
      id: "FOOD_003",
      name: "Crispy Samosa (2 Pcs)",
      category: "Snacks",
      description: "Flaky golden pastry filled with spiced potatoes, green peas and roasted cumin, served with sweet tamarind & mint chutney.",
      price: 30,
      image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80",
      ingredients: ["Refined flour", "Potatoes", "Peas", "Cumin", "Garam masala", "Tamarind chutney", "Mint chutney"],
      prepTime: "3 mins",
      isVeg: true,
      rating: 4.9,
      ratingCount: 520,
      isAvailable: true,
      isSpecial: true,
      calories: 260
    },
    {
      id: "FOOD_004",
      name: "Crispy Veg Burger",
      category: "Fast Food",
      description: "Toasted sesame bun with a crispy spiced vegetable patty, fresh lettuce, sliced tomatoes, onions, and spicy mayo.",
      price: 70,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
      ingredients: ["Sesame bun", "Crispy veg patty", "Lettuce", "Tomato", "Onion", "Cheese blend", "Herb mayo"],
      prepTime: "12 mins",
      isVeg: true,
      rating: 4.6,
      ratingCount: 410,
      isAvailable: true,
      isSpecial: false,
      calories: 420
    },
    {
      id: "FOOD_005",
      name: "Paneer Tikka Roll",
      category: "Fast Food",
      description: "Tandoori marinated cottage cheese cubes wrapped in flaky paratha with crunchy onions, capsicum, and mint sauce.",
      price: 80,
      image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80",
      ingredients: ["Paneer", "Flaky paratha", "Bell peppers", "Onion", "Tandoori masala", "Mint coriander chutney"],
      prepTime: "10 mins",
      isVeg: true,
      rating: 4.9,
      ratingCount: 615,
      isAvailable: true,
      isSpecial: true,
      calories: 450
    },
    {
      id: "FOOD_006",
      name: "Steamed Veg Momos (6 Pcs)",
      category: "Snacks",
      description: "Delicate thin-wrapper steamed dumplings stuffed with finely minced cabbage, carrots, ginger, served with fiery red chili dip.",
      price: 60,
      image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80",
      ingredients: ["Flour dough", "Cabbage", "Carrot", "Spring onions", "Ginger-garlic", "Spicy tomato-chili dip"],
      prepTime: "7 mins",
      isVeg: true,
      rating: 4.7,
      ratingCount: 380,
      isAvailable: true,
      isSpecial: false,
      calories: 210
    },
    {
      id: "FOOD_007",
      name: "Chole Bhature (2 Bhature)",
      category: "Meals",
      description: "Puffy fried bhature served with rich, aromatic Punjabi spiced chickpea curry, pickled onions, and green chilies.",
      price: 80,
      image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80",
      ingredients: ["Bhatura flour", "Chickpeas", "Pomegranate seeds", "Ginger juliennes", "Pickled onions"],
      prepTime: "12 mins",
      isVeg: true,
      rating: 4.9,
      ratingCount: 780,
      isAvailable: true,
      isSpecial: true,
      calories: 590
    },
    {
      id: "FOOD_008",
      name: "Classic Cheese Maggi",
      category: "Snacks",
      description: "Hot, soupy, spiced noodles cooked with sweet corn, capsicum, peas, topped with melted cheddar cheese.",
      price: 50,
      image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80",
      ingredients: ["Maggi noodles", "Tastemaker", "Sweet corn", "Capsicum", "Processed cheese", "Butter"],
      prepTime: "6 mins",
      isVeg: true,
      rating: 4.8,
      ratingCount: 920,
      isAvailable: true,
      isSpecial: false,
      calories: 340
    },
    {
      id: "FOOD_009",
      name: "Frothy Cold Coffee",
      category: "Beverages",
      description: "Thick, creamy blend of rich espresso, chilled milk, and vanilla ice cream, dusted with cocoa powder.",
      price: 50,
      image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80",
      ingredients: ["Espresso roast", "Full-cream milk", "Vanilla ice cream", "Chocolate drizzle", "Sugar"],
      prepTime: "4 mins",
      isVeg: true,
      rating: 4.9,
      ratingCount: 840,
      isAvailable: true,
      isSpecial: true,
      calories: 220
    },
    {
      id: "FOOD_010",
      name: "Adrak Masala Chai",
      category: "Beverages",
      description: "Aromatic, piping hot brewed Assam tea infused with crushed fresh ginger, cardamom, cinnamon, and whole milk.",
      price: 20,
      image: "https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?auto=format&fit=crop&w=600&q=80",
      ingredients: ["Assam tea leaves", "Fresh crushed ginger", "Green cardamom", "Milk", "Sugar"],
      prepTime: "3 mins",
      isVeg: true,
      rating: 4.9,
      ratingCount: 1150,
      isAvailable: true,
      isSpecial: false,
      calories: 90
    },
    {
      id: "FOOD_011",
      name: "South Indian Filter Coffee",
      category: "Beverages",
      description: "Traditional decoction coffee brewed with chicory blend and frothed hot milk served in brass davarah.",
      price: 30,
      image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
      ingredients: ["Coffee decoction", "Chicory", "Hot milk", "Sugar"],
      prepTime: "4 mins",
      isVeg: true,
      rating: 4.8,
      ratingCount: 460,
      isAvailable: true,
      isSpecial: false,
      calories: 110
    },
    {
      id: "FOOD_012",
      name: "Fresh Seasonal Mango Juice",
      category: "Beverages",
      description: "Pure chilled Alphonso mango pulp blended with a touch of mint and lime for an instant refresher.",
      price: 50,
      image: "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=600&q=80",
      ingredients: ["Mango pulp", "Chilled water", "Mint sprig", "Lime drops"],
      prepTime: "3 mins",
      isVeg: true,
      rating: 4.7,
      ratingCount: 290,
      isAvailable: true,
      isSpecial: false,
      calories: 160
    },
    {
      id: "FOOD_013",
      name: "Executive Deluxe Thali",
      category: "Meals",
      description: "Complete balanced lunch: 3 Butter Rotis, Steamed Basmati Rice, Paneer Butter Masala, Dal Makhani, Raita, Salad & Gulab Jamun.",
      price: 120,
      image: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80",
      ingredients: ["Paneer butter masala", "Dal makhani", "Basmati rice", "Butter rotis", "Boondi raita", "Salad", "Gulab jamun"],
      prepTime: "10 mins",
      isVeg: true,
      rating: 4.9,
      ratingCount: 670,
      isAvailable: true,
      isSpecial: true,
      calories: 780
    },
    {
      id: "FOOD_014",
      name: "Rajma Chawal Bowl",
      category: "Meals",
      description: "Slow-cooked Kashmiri red kidney beans in rich tomato-onion gravy layered over aromatic steamed basmati rice.",
      price: 70,
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80",
      ingredients: ["Red kidney beans", "Basmati rice", "Tomatoes", "Ginger garlic paste", "Garam masala", "Coriander garnish"],
      prepTime: "6 mins",
      isVeg: true,
      rating: 4.8,
      ratingCount: 540,
      isAvailable: true,
      isSpecial: false,
      calories: 490
    },
    {
      id: "FOOD_015",
      name: "Grilled Chicken Club Sandwich",
      category: "Fast Food",
      description: "Triple-decker toasted bread filled with shredded tandoori chicken, fried egg, lettuce, cheddar slice, and pepper mayo.",
      price: 90,
      image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80",
      ingredients: ["Bread slices", "Tandoori chicken", "Egg", "Cheddar cheese", "Lettuce", "Pepper mayo"],
      prepTime: "12 mins",
      isVeg: false,
      rating: 4.8,
      ratingCount: 490,
      isAvailable: true,
      isSpecial: true,
      calories: 520
    },
    {
      id: "FOOD_016",
      name: "Chicken Biryani Box",
      category: "Meals",
      description: "Fragrant long-grain Dum Biryani packed with tender spiced chicken pieces, caramelized onions, and mint raita.",
      price: 130,
      image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80",
      ingredients: ["Aged basmati rice", "Marinated chicken", "Saffron milk", "Biryani spices", "Mint raita", "Salan"],
      prepTime: "8 mins",
      isVeg: false,
      rating: 4.9,
      ratingCount: 890,
      isAvailable: true,
      isSpecial: true,
      calories: 680
    },
    {
      id: "FOOD_017",
      name: "Loaded Peri-Peri Fries",
      category: "Fast Food",
      description: "Golden crispy potato batons tossed in fiery African peri-peri seasoning and drizzled with creamy garlic cheese sauce.",
      price: 65,
      image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80",
      ingredients: ["Potatoes", "Peri peri spice mix", "Garlic dip", "Cheddar drizzle", "Oregano"],
      prepTime: "8 mins",
      isVeg: true,
      rating: 4.7,
      ratingCount: 395,
      isAvailable: true,
      isSpecial: false,
      calories: 380
    },
    {
      id: "FOOD_018",
      name: "Pao Bhaji (2 Butter Pao)",
      category: "Meals",
      description: "Mashed spiced vegetable curry cooked on a flat tawa with dollops of Amul butter, served with toasted butter pao and chopped onions.",
      price: 75,
      image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=600&q=80",
      ingredients: ["Potatoes", "Cauliflower", "Peas", "Butter pav", "Pav bhaji masala", "Lemon", "Onions"],
      prepTime: "9 mins",
      isVeg: true,
      rating: 4.8,
      ratingCount: 510,
      isAvailable: true,
      isSpecial: false,
      calories: 460
    },
    {
      id: "FOOD_019",
      name: "Hot Chocolate Brownie with Ice Cream",
      category: "Desserts",
      description: "Fudgy warm walnut chocolate brownie topped with a scoop of vanilla bean ice cream and hot chocolate fudge.",
      price: 70,
      image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80",
      ingredients: ["Cocoa", "Dark chocolate", "Walnuts", "Vanilla ice cream", "Chocolate syrup"],
      prepTime: "5 mins",
      isVeg: true,
      rating: 4.9,
      ratingCount: 640,
      isAvailable: true,
      isSpecial: true,
      calories: 410
    },
    {
      id: "FOOD_020",
      name: "Gulab Jamun (2 Pcs)",
      category: "Desserts",
      description: "Soft golden milk-solid dumplings soaked in warm rose and green cardamom flavored sugar syrup.",
      price: 35,
      image: "https://images.unsplash.com/photo-1593701461250-d7b22dfd3a77?auto=format&fit=crop&w=600&q=80",
      ingredients: ["Khoya", "Paneer", "Rose syrup", "Cardamom", "Pistachio slivers"],
      prepTime: "2 mins",
      isVeg: true,
      rating: 4.8,
      ratingCount: 420,
      isAvailable: true,
      isSpecial: false,
      calories: 280
    },
    {
      id: "FOOD_021",
      name: "Idli Vada Sambar Combo",
      category: "Breakfast",
      description: "Two pillow-soft steamed idlis and one crispy medu vada served with hot spicy lentil sambar and fresh coconut dip.",
      price: 50,
      image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80",
      ingredients: ["Rice and urad dal batter", "Curry leaves", "Black pepper", "Sambar", "Coconut chutney"],
      prepTime: "4 mins",
      isVeg: true,
      rating: 4.8,
      ratingCount: 310,
      isAvailable: true,
      isSpecial: false,
      calories: 320
    },
    {
      id: "FOOD_022",
      name: "Chicken Momos Steamed (6 Pcs)",
      category: "Snacks",
      description: "Succulent chicken mince mixed with scallions, crushed black pepper and ginger, wrapped in delicate pastry skin.",
      price: 80,
      image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=600&q=80",
      ingredients: ["Chicken mince", "Spring onion", "Sesame oil", "Garlic dip", "Spicy schezwan sauce"],
      prepTime: "8 mins",
      isVeg: false,
      rating: 4.9,
      ratingCount: 530,
      isAvailable: true,
      isSpecial: false,
      calories: 270
    },
    {
      id: "FOOD_023",
      name: "Fresh Fruit Salad Bowl",
      category: "Desserts",
      description: "Crisp diced apples, pomegranate pearls, sweet papaya, kiwi, and grapes drizzled with honey and chaat masala.",
      price: 55,
      image: "https://images.unsplash.com/photo-1519996529931-28324d5a630e?auto=format&fit=crop&w=600&q=80",
      ingredients: ["Apple", "Pomegranate", "Papaya", "Kiwi", "Grapes", "Honey drizzle", "Chaat masala"],
      prepTime: "5 mins",
      isVeg: true,
      rating: 4.7,
      ratingCount: 180,
      isAvailable: true,
      isSpecial: false,
      calories: 140
    },
    {
      id: "FOOD_024",
      name: "Crispy Paneer Pakoda (4 Pcs)",
      category: "Snacks",
      description: "Thick cubes of fresh malai paneer layered with mint chutney, dipped in spiced gram flour batter and fried crisp.",
      price: 65,
      image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80",
      ingredients: ["Fresh paneer", "Gram flour", "Carom seeds (ajwain)", "Green chutney", "Chaat masala"],
      prepTime: "8 mins",
      isVeg: true,
      rating: 4.7,
      ratingCount: 310,
      isAvailable: true,
      isSpecial: false,
      calories: 340
    }
  ],

  // Sample Registered Users
  users: [
    {
      id: "STU1024",
      name: "Aarav Sharma",
      email: "student@college.edu",
      phone: "+91 98765 43210",
      department: "Computer Science & Engineering",
      year: "3rd Year (Semester 6)",
      password: "student123", // Demo plain text for frontend simulation
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
      walletBalance: 350.00,
      isBlocked: false,
      joinedDate: "2024-08-10",
      favorites: ["FOOD_001", "FOOD_005", "FOOD_009"]
    },
    {
      id: "STU1088",
      name: "Priya Patel",
      email: "priya.patel@college.edu",
      phone: "+91 98112 34567",
      department: "Electronics & Communication",
      year: "2nd Year (Semester 4)",
      password: "student123",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
      walletBalance: 180.00,
      isBlocked: false,
      joinedDate: "2025-01-15",
      favorites: ["FOOD_004", "FOOD_010"]
    }
  ],

  // Default Admin Credentials
  admin: {
    id: "ADM8801",
    name: "Campus Canteen Manager",
    email: "admin@canteen.edu",
    password: "admin123",
    role: "Super Admin",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80"
  },

  // Active Promo Coupons
  coupons: [
    {
      code: "CANTEEN20",
      discountPercent: 20,
      minOrder: 100,
      maxDiscount: 60,
      expiry: "2026-12-31",
      description: "20% OFF on orders above ₹100 (Max ₹60)",
      usageLimit: 500,
      usedCount: 142,
      isActive: true
    },
    {
      code: "WELCOME50",
      discountAmount: 50,
      minOrder: 150,
      expiry: "2026-12-31",
      description: "Flat ₹50 OFF on your meal order above ₹150",
      usageLimit: 1000,
      usedCount: 423,
      isActive: true
    },
    {
      code: "CAMPUS10",
      discountPercent: 10,
      minOrder: 50,
      maxDiscount: 30,
      expiry: "2026-12-31",
      description: "10% Student Discount on any order above ₹50",
      usageLimit: 2000,
      usedCount: 880,
      isActive: true
    }
  ],

  // Sample Orders for history, tracking & admin management
  orders: [
    {
      orderId: "CAN20260906001",
      tokenNumber: "B-42",
      studentId: "STU1024",
      studentName: "Aarav Sharma",
      studentEmail: "student@college.edu",
      studentPhone: "+91 98765 43210",
      items: [
        { foodId: "FOOD_005", name: "Paneer Tikka Roll", price: 80, quantity: 1, image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=300&q=80" },
        { foodId: "FOOD_009", name: "Frothy Cold Coffee", price: 50, quantity: 1, image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=300&q=80" }
      ],
      subtotal: 130,
      discount: 26,
      couponApplied: "CANTEEN20",
      tax: 0,
      totalAmount: 104,
      paymentMethod: "Campus Wallet",
      paymentStatus: "Successful",
      orderStatus: "Preparing", // Pending | Confirmed | Preparing | Ready | Completed | Cancelled
      orderTime: "2026-09-06T10:15:00",
      estimatedPrepTime: "10 mins",
      pickupCounter: "Counter 2 (Snacks & Fast Food)",
      pickupSlot: "Break Time (10:45 AM)",
      specialNotes: "Extra green chutney please!"
    },
    {
      orderId: "CAN20260906002",
      tokenNumber: "A-15",
      studentId: "STU1088",
      studentName: "Priya Patel",
      studentEmail: "priya.patel@college.edu",
      studentPhone: "+91 98112 34567",
      items: [
        { foodId: "FOOD_001", name: "Masala Dosa", price: 50, quantity: 2, image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=300&q=80" },
        { foodId: "FOOD_010", name: "Adrak Masala Chai", price: 20, quantity: 2, image: "https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?auto=format&fit=crop&w=300&q=80" }
      ],
      subtotal: 140,
      discount: 14,
      couponApplied: "CAMPUS10",
      tax: 0,
      totalAmount: 126,
      paymentMethod: "UPI / QR Code",
      paymentStatus: "Successful",
      orderStatus: "Ready",
      orderTime: "2026-09-06T09:40:00",
      estimatedPrepTime: "8 mins",
      pickupCounter: "Counter 1 (South Indian & Meals)",
      pickupSlot: "Morning Break (10:00 AM)",
      specialNotes: ""
    },
    {
      orderId: "CAN20260905018",
      tokenNumber: "C-08",
      studentId: "STU1024",
      studentName: "Aarav Sharma",
      studentEmail: "student@college.edu",
      studentPhone: "+91 98765 43210",
      items: [
        { foodId: "FOOD_013", name: "Executive Deluxe Thali", price: 120, quantity: 1, image: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=300&q=80" }
      ],
      subtotal: 120,
      discount: 0,
      couponApplied: null,
      tax: 0,
      totalAmount: 120,
      paymentMethod: "Campus Wallet",
      paymentStatus: "Successful",
      orderStatus: "Completed",
      orderTime: "2026-09-05T13:20:00",
      estimatedPrepTime: "12 mins",
      pickupCounter: "Counter 1 (South Indian & Meals)",
      pickupSlot: "Lunch Break (1:30 PM)",
      specialNotes: ""
    }
  ],

  // Inventory Stocks
  inventory: [
    { id: "INV_001", itemName: "Basmati Rice Bags", currentStock: 45, unit: "Kg", minStock: 20, status: "In Stock", lastRestocked: "2026-09-01" },
    { id: "INV_002", itemName: "Fresh Malai Paneer", currentStock: 6, unit: "Kg", minStock: 10, status: "Low Stock", lastRestocked: "2026-09-05" },
    { id: "INV_003", itemName: "Amul Full Cream Milk", currentStock: 28, unit: "Liters", minStock: 15, status: "In Stock", lastRestocked: "2026-09-06" },
    { id: "INV_004", itemName: "Refined Wheat Flour", currentStock: 35, unit: "Kg", minStock: 15, status: "In Stock", lastRestocked: "2026-09-03" },
    { id: "INV_005", itemName: "Burger Buns (Pack of 6)", currentStock: 4, unit: "Packs", minStock: 12, status: "Low Stock", lastRestocked: "2026-09-04" },
    { id: "INV_006", itemName: "Coffee Beans / Roast", currentStock: 8, unit: "Kg", minStock: 5, status: "In Stock", lastRestocked: "2026-08-28" },
    { id: "INV_007", itemName: "Cooking Oil Tins (15L)", currentStock: 5, unit: "Tins", minStock: 3, status: "In Stock", lastRestocked: "2026-09-02" },
    { id: "INV_008", itemName: "Eco Paper Cups (200ml)", currentStock: 350, unit: "Cups", minStock: 200, status: "In Stock", lastRestocked: "2026-09-04" },
    { id: "INV_009", itemName: "Potatoes & Onions", currentStock: 55, unit: "Kg", minStock: 30, status: "In Stock", lastRestocked: "2026-09-05" },
    { id: "INV_010", itemName: "Amul Butter Bricks (500g)", currentStock: 1, unit: "Packs", minStock: 8, status: "Out of Stock", lastRestocked: "2026-09-01" }
  ],

  // Wallet Transactions for student
  walletTransactions: [
    { id: "TXN_901", type: "credit", amount: 500.00, title: "Wallet Recharge via UPI", date: "2026-09-04 09:30 AM", status: "Successful", refOrder: null },
    { id: "TXN_902", type: "debit", amount: 120.00, title: "Canteen Order Payment", date: "2026-09-05 01:21 PM", status: "Successful", refOrder: "CAN20260905018" },
    { id: "TXN_903", type: "debit", amount: 104.00, title: "Canteen Order Payment", date: "2026-09-06 10:16 AM", status: "Successful", refOrder: "CAN20260906001" },
    { id: "TXN_904", type: "credit", amount: 74.00, title: "Promotional Cashback Offer", date: "2026-09-06 10:17 AM", status: "Successful", refOrder: null }
  ],

  // Student Reviews & Feedback
  feedback: [
    {
      id: "REV_001",
      studentName: "Rohan Verma",
      department: "CSE, 4th Year",
      foodRating: 5,
      serviceRating: 5,
      category: "Food Quality",
      comment: "The digital ordering system has completely eliminated the 20-minute queue between classes. The Masala Dosa and Cold Coffee are consistently top notch!",
      date: "2026-09-05",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
    },
    {
      id: "REV_002",
      studentName: "Ananya Iyer",
      department: "Biotech, 2nd Year",
      foodRating: 5,
      serviceRating: 4,
      category: "Hygiene",
      comment: "Super clean kitchen, eco-friendly packaging, and prompt notification when food is ready. Really impressed by the campus wallet integration!",
      date: "2026-09-04",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
    },
    {
      id: "REV_003",
      studentName: "Tanmay Deshmukh",
      department: "Mechanical, 3rd Year",
      foodRating: 4,
      serviceRating: 5,
      category: "Speed",
      comment: "Paneer rolls are juicy and fresh. Token tracking saves us from crowding around the pickup window.",
      date: "2026-09-03",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
    }
  ],

  // Notifications
  notifications: [
    {
      id: "NOTIF_01",
      title: "Order Being Prepared",
      message: "Your order CAN20260906001 is now sizzling in the kitchen! Estimated prep: 10 mins.",
      time: "10 mins ago",
      type: "order",
      isRead: false
    },
    {
      id: "NOTIF_02",
      title: "🎉 Special Discount Live",
      message: "Get 20% OFF today using code CANTEEN20 on all orders above ₹100.",
      time: "1 hour ago",
      type: "promo",
      isRead: false
    },
    {
      id: "NOTIF_03",
      title: "Wallet Cashback Credited",
      message: "₹74.00 campus cashback was added to your wallet for early morning orders!",
      time: "2 hours ago",
      type: "wallet",
      isRead: true
    },
    {
      id: "NOTIF_04",
      title: "Today's Chef Special",
      message: "Crispy Samosas & Filter Coffee combo available at Counter 2.",
      time: "Yesterday",
      type: "menu",
      isRead: true
    }
  ]
};

// Export to window
if (typeof window !== "undefined") {
  window.INITIAL_DATA = INITIAL_DATA;
}
