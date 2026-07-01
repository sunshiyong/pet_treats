/* ============================================
   PetNurture — 完整交互脚本
   ============================================ */

// ==================== PRODUCT DATA ====================
const STORAGE_VERSION = "v1.0";

// Clear stale localStorage on version mismatch
try {
  let ver = localStorage.getItem("pnVersion");
  if (ver !== STORAGE_VERSION) {
    localStorage.removeItem("pnUser");
    localStorage.removeItem("pnCart");
    localStorage.setItem("pnVersion", STORAGE_VERSION);
  }
} catch(e) {}

const PRODUCTS = [
  {
    id: 1, name: "低温烘焙鸡胸肉", category: "鸡肉", petTypes: ["dog"],
    price: 49.9, sales: 3286, spec: "150g / 袋", image: "assets/images/product-01.svg",
    emoji: "🍗",
    bullets: ["🥚 精选去皮鸡胸肉，低脂高蛋白", "U0001F525 72°C 低温慢烘，锁住营养", "🦑 无油无盐，保留天然肉香"],
    ingredients: "鸡胸肉 100%", palatability: ["🐾 狗狗★★★★★", "🐱 猫咪★★★"]
  },
  {
    id: 2, name: "风干鸭肉卷", category: "鸡肉", petTypes: ["dog"],
    price: 45.0, sales: 2154, spec: "180g / 袋", image: "assets/images/product-02.svg",
    emoji: "🥩",
    bullets: ["🥚 新鲜鸭胸肉整块风干", "❄️ 低温风干工艺，口感柔韧", "🌾 丰富维生素 B ＆ E"],
    ingredients: "鸭胸肉 100%", palatability: ["🐾 狗狗★★★★★"]
  },
  {
    id: 3, name: "三文鱼冻干", category: "冻干", petTypes: ["cat", "dog"],
    price: 69.9, sales: 4521, spec: "100g / 罐", image: "assets/images/product-03.svg",
    emoji: "🐟",
    bullets: ["🐟 阿勒斯加鲁海捕野生三文鱼", "❄️ -40°C 蒸汽冷冻，完整保留营养", "🧊 丰富 Omega-3，护毛及关节"],
    ingredients: "三文鱼 100%", palatability: ["🐾 狗狗★★★★★", "🐱 猫咪★★★★★"]
  },
  {
    id: 4, name: "鳒鱼松冻干", category: "冻干", petTypes: ["cat", "dog"],
    price: 55.0, sales: 1876, spec: "80g / 罐", image: "assets/images/product-04.svg",
    emoji: "🐠",
    bullets: ["🐠 日本北海道棲鳒鱼，占比 99%", "☁️ 松脆粉末口感，小口咮心容易吃", "🥦 每日少量喂食即可补充多种营养"],
    ingredients: "鳒鱼肉 99%，维生素 E", palatability: ["🐾 狗狗★★★★", "🐱 猫咪★★★★★"]
  },
  {
    id: 5, name: "薄荷洁齿棒", category: "洁齿", petTypes: ["dog"],
    price: 39.9, sales: 2934, spec: "12根 / 盒", image: "assets/images/product-05.svg",
    emoji: "🦷",
    bullets: ["🌿 新鲜薄荷叶硬取粉，口气清新", "🦷 V型凸起设计，整合清洁齿缝", "🍎 追加苹果细维，助消化"],
    ingredients: "鸡胸肉、薄荷叶粉、苹果组组维", palatability: ["🐾 狗狗★★★★★"]
  },
  {
    id: 6, name: "螺旋洁齿骨", category: "洁齿", petTypes: ["dog"],
    price: 45.0, sales: 1632, spec: "10根 / 盒", image: "assets/images/product-06.svg",
    emoji: "🪪",
    bullets: ["🪪 螺旋结构，更好地清洁牙齿表面", "🥪 益生菌配方，维护口腔健康", "🐾 耐周口感，快乐型娱乐兼清洁"],
    ingredients: "牛皮、雀齿粉、益生菌", palatability: ["🐾 狗狗★★★★"]
  },
  {
    id: 7, name: "羊奶小圆饼", category: "训练奖励", petTypes: ["cat", "dog"],
    price: 29.9, sales: 3589, spec: "100g / 袋", image: "assets/images/product-07.svg",
    emoji: "🥞",
    bullets: ["🐑 新鲜羊奶为主原料，乳糖小婲更容易消化", "🍪 小小圆饼形状，适合训练奖励", "🥣 追加蒸芠，软活糁道有利益生菌"],
    ingredients: "羊奶 60%、蒸芠、米粉", palatability: ["🐾 狗狗★★★★★", "🐱 猫咪★★★★"]
  },
  {
    id: 8, name: "牛肉能量粒", category: "训练奖励", petTypes: ["dog"],
    price: 42.9, sales: 2487, spec: "120g / 袋", image: "assets/images/product-08.svg",
    emoji: "🥩",
    bullets: ["🐂 非盟新西兰草物喂养照知牛肉", "⚡ 高能量小粒，适合娱乐或奖励时使用", "🌱 无谷物追加，天然健康"],
    ingredients: "牛肉 90%、红莓、蒸芠", palatability: ["🐾 狗狗★★★★★"]
  }
];

// ==================== STATE ====================
let user = JSON.parse(localStorage.getItem("pnUser") || "null");
let cart = JSON.parse(localStorage.getItem("pnCart") || "[]");
let petFilter = "all";
let foodFilter = "all";
let currentProductId = null;
let modalQty = 1;

// ==================== INIT ====================
function init() {
  initUserState();
  renderProducts("all", "all");
  renderHotProducts();
  updateCartUI();
  bindEvents();
}
document.addEventListener("DOMContentLoaded", init);

// ==================== FILTER ====================
function filterByPet(products, pet) {
  if (pet === "all") return products;
  return products.filter(function(p) {
    return p.petTypes && p.petTypes.indexOf(pet) !== -1;
  });
}

function getAvailableFoodCategories(pet) {
  var filtered = pet === "all" ? PRODUCTS : filterByPet(PRODUCTS, pet);
  var cats = {};
  filtered.forEach(function(p) { cats[p.category] = true; });
  return Object.keys(cats);
}

function updateFoodFilterBar(pet) {
  var bar = document.getElementById("foodFilterBar");
  var available = getAvailableFoodCategories(pet);
  var html = '<button class="filter-btn filter-btn--food active" data-food="all">🍽️ 全部食品</button>';
  available.forEach(function(cat) {
    var icon = cat === "鸡肉" ? "🍗" : cat === "冻干" ? "❄️" : cat === "洁齿" ? "🦷" : "🎯";
    html += '<button class="filter-btn filter-btn--food" data-food="' + cat + '">' + icon + ' ' + cat + '</button>';
  });
  bar.innerHTML = html;

  bar.querySelectorAll(".filter-btn--food").forEach(function(btn) {
    btn.addEventListener("click", function() {
      bar.querySelectorAll(".filter-btn--food").forEach(function(b) { b.classList.remove("active"); });
      this.classList.add("active");
      foodFilter = this.dataset.food;
      renderProducts(petFilter, foodFilter);
    });
  });
}

function renderProducts(pet, food) {
  var grid = document.getElementById("productGrid");
  var byPet = filterByPet(PRODUCTS, pet);
  var filtered = food === "all" ? byPet : byPet.filter(function(p) { return p.category === food; });

  if (filtered.length === 0) {
    grid.innerHTML = '<div class="products__empty" style="grid-column:1/-1;text-align:center;padding:60px 20px;"><p style="font-size:1.2rem;color:var(--color-text-muted);margin-bottom:8px;">暂无匹配商品</p><p style="font-size:0.85rem;color:var(--color-text-muted);">试试其他分类吧</p></div>';
    return;
  }

  grid.innerHTML = filtered.map(function(p) {
    var imgTag = '<img class="product-card__image" src="' + p.image + '" alt="' + p.name + '" loading="lazy" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">' +
      '<div class="product-card__image-fallback" style="display:none">' + p.emoji + '</div>';
    return '<div class="product-card" data-id="' + p.id + '">' + imgTag +
      '<div class="product-card__body">' +
      '<div class="product-card__top"><span class="product-card__category">' + p.category + '</span>' +
      '<span class="product-card__tag">' + (p.category === "冻干" ? "☁️" : p.category === "鸡肉" ? "🍗" : p.category === "洁齿" ? "🦷" : "🎯") + '</span></div>' +
      '<h3 class="product-card__name">' + p.name + '</h3>' +
      '<p class="product-card__spec">' + p.spec + '</p>' +
      '<p class="product-card__sales">已售 ' + p.sales.toLocaleString() + ' 笔</p>' +
      '<div class="product-card__footer">' +
      '<span class="product-card__price">¥' + p.price.toFixed(1) + '</span>' +
      '<button class="product-card__btn add-cart-btn" data-id="' + p.id + '">加入购物车</button>' +
      '</div></div></div>';
  }).join("");

  document.querySelectorAll(".product-card").forEach(function(el) {
    el.addEventListener("click", function(e) {
      if (e.target.classList.contains("add-cart-btn")) return;
      openDetail(parseInt(this.dataset.id));
    });
  });

  document.querySelectorAll(".add-cart-btn").forEach(function(btn) {
    btn.addEventListener("click", function(e) {
      e.stopPropagation();
      var id = parseInt(this.dataset.id);
      addToCart(id, 1);
      showToast(getProduct(id).name + " ✓ 已加入购物车");
      updateCartUI();
    });
  });
}

function renderHotProducts() {
  var grid = document.getElementById("hotGrid");
  var top3 = PRODUCTS.slice().sort(function(a, b) { return b.sales - a.sales; }).slice(0, 3);
  var rankIcons = ["🥇", "🥈", "🥉"];
  grid.innerHTML = top3.map(function(p, i) {
    return '<div class="hot-card" data-id="' + p.id + '">' +
      '<span class="hot-card__rank hot-card__rank--' + (i+1) + '">' + rankIcons[i] + '</span>' +
      '<span class="hot-card__img">' + p.emoji + '</span>' +
      '<div class="hot-card__info"><div class="hot-card__name">' + p.name + '</div>' +
      '<div class="hot-card__meta">已售 ' + p.sales.toLocaleString() + ' 笔</div></div>' +
      '<span class="hot-card__price">¥' + p.price.toFixed(1) + '</span></div>';
  }).join("");

  grid.querySelectorAll(".hot-card").forEach(function(el) {
    el.addEventListener("click", function() { openDetail(parseInt(this.dataset.id)); });
  });
}

// ==================== CART ====================
function addToCart(id, qty) {
  var existing = null;
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id === id) { existing = cart[i]; break; }
  }
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: id, qty: qty });
  }
  saveCart();
}

function removeFromCart(id) {
  var newCart = [];
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id !== id) newCart.push(cart[i]);
  }
  cart = newCart;
  saveCart();
  updateCartUI();
}

function updateQty(id, newQty) {
  if (newQty <= 0) {
    removeFromCart(id);
    return;
  }
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id === id) { cart[i].qty = newQty; break; }
  }
  saveCart();
  updateCartUI();
}

function getCartTotal() {
  var total = 0;
  for (var i = 0; i < cart.length; i++) {
    var p = getProduct(cart[i].id);
    if (p) total += p.price * cart[i].qty;
  }
  return total;
}

function getCartCount() {
  var count = 0;
  for (var i = 0; i < cart.length; i++) {
    count += cart[i].qty;
  }
  return count;
}

function saveCart() {
  localStorage.setItem("pnCart", JSON.stringify(cart));
}

function updateCartUI() {
  var badge = document.getElementById("cartBadge");
  var count = getCartCount();
  badge.textContent = count;
  badge.style.display = count > 0 ? "flex" : "none";

  var body = document.getElementById("cartBody");
  var footer = document.getElementById("cartFooter");
  var empty = document.getElementById("cartEmpty");
  var items = document.getElementById("cartItems");

  if (cart.length === 0) {
    empty.style.display = "block";
    items.style.display = "none";
    footer.style.display = "none";
    return;
  }

  empty.style.display = "none";
  items.style.display = "block";
  footer.style.display = "block";

  items.innerHTML = cart.map(function(item) {
    var p = getProduct(item.id);
    if (!p) return "";
    return '<div class="cart-item" data-id="' + item.id + '">' +
      '<span class="cart-item__emoji">' + p.emoji + '</span>' +
      '<div class="cart-item__info">' +
      '<div class="cart-item__name">' + p.name + '</div>' +
      '<div class="cart-item__price">¥' + p.price.toFixed(1) + '</div></div>' +
      '<div class="cart-item__qty">' +
      '<button class="cart-qty-btn cart-qty-minus" data-id="' + item.id + '">−</button>' +
      '<span class="cart-qty-val">' + item.qty + '</span>' +
      '<button class="cart-qty-btn cart-qty-plus" data-id="' + item.id + '">+</button></div>' +
      '<span class="cart-item__subtotal">¥' + (p.price * item.qty).toFixed(1) + '</span>' +
      '<button class="cart-item__remove" data-id="' + item.id + '">×</button></div>';
  }).join("");

  document.getElementById("cartTotal").textContent = "¥" + getCartTotal().toFixed(1);

  // Bind cart item events
  document.querySelectorAll(".cart-qty-minus").forEach(function(btn) {
    btn.addEventListener("click", function() {
      var id = parseInt(this.dataset.id);
      var item = null;
      for (var i = 0; i < cart.length; i++) {
        if (cart[i].id === id) { item = cart[i]; break; }
      }
      if (item) updateQty(id, item.qty - 1);
    });
  });
  document.querySelectorAll(".cart-qty-plus").forEach(function(btn) {
    btn.addEventListener("click", function() {
      var id = parseInt(this.dataset.id);
      var item = null;
      for (var i = 0; i < cart.length; i++) {
        if (cart[i].id === id) { item = cart[i]; break; }
      }
      if (item) updateQty(id, item.qty + 1);
    });
  });
  document.querySelectorAll(".cart-item__remove").forEach(function(btn) {
    btn.addEventListener("click", function() {
      removeFromCart(parseInt(this.dataset.id));
    });
  });
}

// ==================== MODALS ====================
function openModal(id) {
  document.getElementById(id).classList.add("open");
  document.body.classList.add("modal-open");
}

function closeModal(id) {
  document.getElementById(id).classList.remove("open");
  document.body.classList.remove("modal-open");
}

function openCart() {
  document.getElementById("cartSidebar").classList.add("open");
  document.getElementById("cartOverlay").classList.add("open");
  document.body.classList.add("modal-open");
}

function closeCart() {
  document.getElementById("cartSidebar").classList.remove("open");
  document.getElementById("cartOverlay").classList.remove("open");
  document.body.classList.remove("modal-open");
}

// ==================== PRODUCT DETAIL ====================
function getProduct(id) {
  for (var i = 0; i < PRODUCTS.length; i++) {
    if (PRODUCTS[i].id === id) return PRODUCTS[i];
  }
  return null;
}

function openDetail(id) {
  var p = getProduct(id);
  if (!p) return;
  currentProductId = id;
  modalQty = 1;
  document.getElementById("qtyValue").textContent = "1";

  var img = document.getElementById("modalImage");
  var fallback = document.getElementById("modalImageFallback");

  img.src = p.image;
  img.alt = p.name;
  img.onerror = function() { fallback.style.display = "flex"; img.style.display = "none"; };
  img.onload = function() { fallback.style.display = "none"; img.style.display = "block"; };
  if (img.complete && img.naturalWidth > 0) {
    fallback.style.display = "none"; img.style.display = "block";
  } else {
    fallback.style.display = "flex"; img.style.display = "none";
  }

  fallback.textContent = p.emoji;
  document.getElementById("modalTag").textContent = p.category;
  document.getElementById("modalTitle").textContent = p.name;
  document.getElementById("modalPrice").textContent = "¥" + p.price.toFixed(1);
  document.getElementById("modalSpec").textContent = p.spec;
  document.getElementById("modalSales").textContent = "已售 " + p.sales.toLocaleString() + " 笔";

  var stars = "★".repeat(p.id <= 4 ? 5 : 4) + "☆".repeat(p.id <= 4 ? 0 : 1);
  document.getElementById("modalRating").textContent = stars;

  document.getElementById("modalBullets").innerHTML = p.bullets.map(function(b) { return "<li>" + b + "</li>"; }).join("");
  document.getElementById("modalIngredients").textContent = p.ingredients;
  document.getElementById("modalPalatability").innerHTML = p.palatability.map(function(pa) {
    return '<span class="pal-item">' + pa + "</span>";
  }).join("");

  openModal("productModal");
}

// ==================== CHECKOUT ====================
function checkout() {
  if (cart.length === 0) {
    showToast("购物车是空的");
    return;
  }

  if (!user || user.isGuest) {
    showToast("🔒 请先登录后再下单");
    openModal("loginModal");
    return;
  }

  var now = new Date();
  var orderNum = "PN" + now.getFullYear() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0") +
    String(Math.floor(Math.random() * 10000)).padStart(4, "0");

  document.getElementById("orderNumber").textContent = orderNum;
  document.getElementById("orderTotal").textContent = "¥" + getCartTotal().toFixed(1);

  closeCart();
  openModal("successModal");
}

// ==================== TOAST ====================
function showToast(msg) {
  var el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("show");
  if (window.toastTimer) clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(function() { el.classList.remove("show"); }, 2500);
}

// ==================== USER SYSTEM ====================
function initUserState() {
  var gate = document.getElementById("loginGate");
  var userBtn = document.getElementById("userBtn");
  var dropdown = document.getElementById("userDropdown");

  if (!user) {
    gate.style.display = "flex";
    userBtn.style.display = "none";
    return;
  }

  gate.style.display = "none";
  if (user.isGuest) {
    userBtn.style.display = "none";
  } else {
    userBtn.style.display = "flex";
    var nameEl = document.getElementById("userDisplayName");
    if (nameEl) nameEl.textContent = user.username || "用户";
  }
}

function handleLogin(username) {
  if (!username || username.trim() === "") return;
  user = {
    isGuest: false,
    username: username.trim(),
    addresses: []
  };
  localStorage.setItem("pnUser", JSON.stringify(user));
  document.getElementById("loginGate").style.display = "none";
  closeModal("loginModal");
  document.getElementById("userBtn").style.display = "flex";
  var nameEl = document.getElementById("userDisplayName");
  if (nameEl) nameEl.textContent = user.username;
  document.getElementById("userDropdown").classList.remove("open");
  showToast("✅ 登录成功，欢迎 " + user.username);
}

function handleGuest() {
  user = { isGuest: true };
  localStorage.setItem("pnUser", JSON.stringify(user));
  document.getElementById("loginGate").style.display = "none";
  showToast("🐾 游客模式，购买需要先登录");
}

function handleLogout() {
  user = null;
  localStorage.removeItem("pnUser");
  document.getElementById("userBtn").style.display = "none";
  document.getElementById("userDropdown").classList.remove("open");
  document.getElementById("loginGate").style.display = "flex";
  showToast("已退出登录");
}

function requireLogin() {
  if (!user || user.isGuest) {
    showToast("🔒 请先登录后再进行此操作");
    openModal("loginModal");
    return false;
  }
  return true;
}

// ==================== ADDRESS MANAGEMENT ====================
function renderAddresses() {
  var list = document.getElementById("addressList");
  if (!user || !user.addresses || user.addresses.length === 0) {
    list.innerHTML = '<p class="address-empty" style="text-align:center;padding:30px 0;color:var(--color-text-muted);font-size:0.9rem;">暂无收货地址<br><span style="font-size:0.8rem;">点击下方添加</span></p>';
    return;
  }

  list.innerHTML = user.addresses.map(function(addr, idx) {
    var isDefault = addr.isDefault;
    return '<div class="address-card' + (isDefault ? ' address-card--default' : '') + '">' +
      '<div class="address-card__name">' + addr.name +
      (isDefault ? ' <span class="address-card__badge">默认</span>' : '') + '</div>' +
      '<div class="address-card__detail">' + addr.detail + '</div>' +
      '<div class="address-card__phone">📞 ' + addr.phone + '</div>' +
      '<div class="address-card__actions">' +
      (isDefault ? '' : '<button class="addr-btn--default" data-idx="' + idx + '">设为默认</button>') +
      '<button class="addr-btn--edit" data-idx="' + idx + '">编辑</button>' +
      '<button class="addr-btn--delete" data-idx="' + idx + '">删除</button>' +
      '</div></div>';
  }).join("");

  document.querySelectorAll(".addr-btn--default").forEach(function(btn) {
    btn.addEventListener("click", function() {
      var idx = parseInt(this.dataset.idx);
      for (var i = 0; i < user.addresses.length; i++) {
        user.addresses[i].isDefault = i === idx;
      }
      saveUser();
      renderAddresses();
      showToast("✅ 已设为默认地址");
    });
  });

  document.querySelectorAll(".addr-btn--edit").forEach(function(btn) {
    btn.addEventListener("click", function() {
      var idx = parseInt(this.dataset.idx);
      var addr = user.addresses[idx];
      document.getElementById("addressFormTitle").textContent = "编辑地址";
      document.getElementById("addressFormId").value = idx;
      document.getElementById("addrName").value = addr.name;
      document.getElementById("addrPhone").value = addr.phone;
      document.getElementById("addrDetail").value = addr.detail;
      closeModal("addressModal");
      openModal("addressFormModal");
    });
  });

  document.querySelectorAll(".addr-btn--delete").forEach(function(btn) {
    btn.addEventListener("click", function() {
      var idx = parseInt(this.dataset.idx);
      user.addresses.splice(idx, 1);
      if (user.addresses.length > 0) {
        var hasDefault = false;
        for (var i = 0; i < user.addresses.length; i++) {
          if (user.addresses[i].isDefault) { hasDefault = true; break; }
        }
        if (!hasDefault) user.addresses[0].isDefault = true;
      }
      saveUser();
      renderAddresses();
      showToast("🗑️ 地址已删除");
    });
  });
}

function saveUser() {
  localStorage.setItem("pnUser", JSON.stringify(user));
}

// ==================== NAV SCROLL ====================
function updateNav() {
  var sections = document.querySelectorAll("section[id]");
  var links = document.querySelectorAll(".nav__link");
  var current = "";
  sections.forEach(function(section) {
    var top = section.offsetTop - 120;
    var bottom = top + section.offsetHeight;
    if (window.scrollY >= top && window.scrollY < bottom) {
      current = section.getAttribute("id");
    }
  });
  links.forEach(function(link) {
    link.classList.toggle("active", link.getAttribute("href") === "#" + current);
  });
}

// ==================== BIND EVENTS ====================
function bindEvents() {
  // Pet type filter
  var petBar = document.getElementById("petFilterBar");
  if (petBar) {
    petBar.querySelectorAll(".filter-btn--pet").forEach(function(btn) {
      btn.addEventListener("click", function() {
        petBar.querySelectorAll(".filter-btn--pet").forEach(function(b) { b.classList.remove("active"); });
        this.classList.add("active");
        petFilter = this.dataset.pet;
        foodFilter = "all";
        updateFoodFilterBar(petFilter);
        var foodBar = document.getElementById("foodFilterBar");
        foodBar.querySelectorAll(".filter-btn--food").forEach(function(b) {
          b.classList.toggle("active", b.dataset.food === "all");
        });
        renderProducts(petFilter, foodFilter);
      });
    });
  }

  // Food filter bindings are done inside updateFoodFilterBar

  // Hamburger
  var hamburger = document.getElementById("hamburger");
  if (hamburger) {
    hamburger.addEventListener("click", function() {
      this.classList.toggle("active");
      document.getElementById("nav").classList.toggle("open");
    });
  }
  document.querySelectorAll(".nav__link").forEach(function(link) {
    link.addEventListener("click", function() {
      var ham = document.getElementById("hamburger");
      if (ham) ham.classList.remove("active");
      document.getElementById("nav").classList.remove("open");
    });
  });

  // Cart toggle
  var cartToggle = document.getElementById("cartToggle");
  if (cartToggle) cartToggle.addEventListener("click", openCart);
  var cartClose = document.getElementById("cartClose");
  if (cartClose) cartClose.addEventListener("click", closeCart);
  var cartOverlay = document.getElementById("cartOverlay");
  if (cartOverlay) cartOverlay.addEventListener("click", closeCart);

  // Product modal
  var modalClose = document.getElementById("modalClose");
  if (modalClose) modalClose.addEventListener("click", function() { closeModal("productModal"); });
  var productModal = document.getElementById("productModal");
  if (productModal) {
    productModal.addEventListener("click", function(e) {
      if (e.target === this) closeModal("productModal");
    });
  }

  var modalAddCart = document.getElementById("modalAddCart");
  if (modalAddCart) {
    modalAddCart.addEventListener("click", function() {
      if (!currentProductId) return;
      var p = getProduct(currentProductId);
      addToCart(currentProductId, modalQty);
      showToast(p.name + " ×" + modalQty + " 已加入购物车");
      updateCartUI();
      closeModal("productModal");
    });
  }

  // Quantity in modal
  var qtyMinus = document.getElementById("qtyMinus");
  if (qtyMinus) {
    qtyMinus.addEventListener("click", function() {
      if (modalQty > 1) { modalQty--; document.getElementById("qtyValue").textContent = modalQty; }
    });
  }
  var qtyPlus = document.getElementById("qtyPlus");
  if (qtyPlus) {
    qtyPlus.addEventListener("click", function() {
      if (modalQty < 99) { modalQty++; document.getElementById("qtyValue").textContent = modalQty; }
    });
  }

  // Checkout
  var checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) checkoutBtn.addEventListener("click", checkout);

  // Success modal
  function closeSuccess() {
    closeModal("successModal");
    cart = [];
    saveCart();
    updateCartUI();
  }
  var successClose = document.getElementById("successClose");
  if (successClose) successClose.addEventListener("click", closeSuccess);
  var successDone = document.getElementById("successDone");
  if (successDone) successDone.addEventListener("click", closeSuccess);
  var successModal = document.getElementById("successModal");
  if (successModal) {
    successModal.addEventListener("click", function(e) {
      if (e.target === this) closeSuccess();
    });
  }

  // Newsletter
  var newsletterForm = document.getElementById("newsletterForm");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function(e) {
      e.preventDefault();
      var input = this.querySelector("input");
      if (input && input.value.trim()) {
        showToast("✉️ 订阅成功！感谢您的关注");
        input.value = "";
      }
    });
  }

  // Login gate
  var gateLoginBtn = document.getElementById("gateLoginBtn");
  if (gateLoginBtn) {
    gateLoginBtn.addEventListener("click", function() {
      document.getElementById("loginGate").style.display = "none";
      openModal("loginModal");
    });
  }
  var gateGuestBtn = document.getElementById("gateGuestBtn");
  if (gateGuestBtn) gateGuestBtn.addEventListener("click", handleGuest);

  // Login form
  var loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function(e) {
      e.preventDefault();
      var username = document.getElementById("loginUsername").value.trim();
      if (username) handleLogin(username);
    });
  }
  var loginModalClose = document.getElementById("loginModalClose");
  if (loginModalClose) {
    loginModalClose.addEventListener("click", function() {
      closeModal("loginModal");
      if (!user) document.getElementById("loginGate").style.display = "flex";
    });
  }
  var loginModal = document.getElementById("loginModal");
  if (loginModal) {
    loginModal.addEventListener("click", function(e) {
      if (e.target === this) {
        closeModal("loginModal");
        if (!user) document.getElementById("loginGate").style.display = "flex";
      }
    });
  }

  // User dropdown
  var userBtn = document.getElementById("userBtn");
  if (userBtn) {
    userBtn.addEventListener("click", function(e) {
      e.stopPropagation();
      document.getElementById("userDropdown").classList.toggle("open");
    });
  }
  document.addEventListener("click", function(e) {
    var dropdown = document.getElementById("userDropdown");
    if (dropdown && !e.target.closest("#userBtn") && !e.target.closest("#userDropdown")) {
      dropdown.classList.remove("open");
    }
  });

  var logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);

  // Address management
  var manageAddressBtn = document.getElementById("manageAddressBtn");
  if (manageAddressBtn) {
    manageAddressBtn.addEventListener("click", function() {
      if (!requireLogin()) return;
      document.getElementById("userDropdown").classList.remove("open");
      renderAddresses();
      openModal("addressModal");
    });
  }

  var addressModalClose = document.getElementById("addressModalClose");
  if (addressModalClose) {
    addressModalClose.addEventListener("click", function() { closeModal("addressModal"); });
  }
  var addressModal = document.getElementById("addressModal");
  if (addressModal) {
    addressModal.addEventListener("click", function(e) {
      if (e.target === this) closeModal("addressModal");
    });
  }

  var addAddressBtn = document.getElementById("addAddressBtn");
  if (addAddressBtn) {
    addAddressBtn.addEventListener("click", function() {
      document.getElementById("addressFormTitle").textContent = "添加新地址";
      document.getElementById("addressFormId").value = "";
      document.getElementById("addrName").value = "";
      document.getElementById("addrPhone").value = "";
      document.getElementById("addrDetail").value = "";
      openModal("addressFormModal");
    });
  }

  var addressFormClose = document.getElementById("addressFormClose");
  if (addressFormClose) {
    addressFormClose.addEventListener("click", function() { closeModal("addressFormModal"); });
  }
  var addressFormModal = document.getElementById("addressFormModal");
  if (addressFormModal) {
    addressFormModal.addEventListener("click", function(e) {
      if (e.target === this) closeModal("addressFormModal");
    });
  }

  var addressForm = document.getElementById("addressForm");
  if (addressForm) {
    addressForm.addEventListener("submit", function(e) {
      e.preventDefault();
      var id = document.getElementById("addressFormId").value;
      var name = document.getElementById("addrName").value.trim();
      var phone = document.getElementById("addrPhone").value.trim();
      var detail = document.getElementById("addrDetail").value.trim();
      if (!name || !phone || !detail) {
        showToast("请填写完整的地址信息");
        return;
      }

      if (!user.addresses) user.addresses = [];

      if (id !== "") {
        var idx = parseInt(id);
        user.addresses[idx].name = name;
        user.addresses[idx].phone = phone;
        user.addresses[idx].detail = detail;
        showToast("✅ 地址已更新");
      } else {
        var isDefault = user.addresses.length === 0;
        user.addresses.push({ name: name, phone: phone, detail: detail, isDefault: isDefault });
        showToast("✅ 新地址已添加");
      }
      saveUser();
      closeModal("addressFormModal");
      renderAddresses();
      openModal("addressModal");
    });
  }

  // Nav active on scroll
  window.addEventListener("scroll", updateNav);
}