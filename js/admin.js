/* ============================================
   PetNurture — 管理后台脚本
   ============================================ */

// ==================== VIRTUAL ORDER DATA ====================
var VIRTUAL_ORDERS = [
  { id: "PN20260601001", createdAt: "2026-06-01T10:23:00", customer: "李小萌", address: {name:"李小萌",phone:"13800138001",detail:"北京市朝阳区建国路88号"}, items: [{productName:"三文鱼冻干",qty:2,price:69.9},{productName:"羊奶小圆饼",qty:1,price:29.9}], total: 169.7, status: "已完成" },
  { id: "PN20260603002", createdAt: "2026-06-03T14:05:00", customer: "王大力", address: {name:"王大力",phone:"13900139002",detail:"上海市浦东新区陆家嘴环路100号"}, items: [{productName:"低温烘焙鸡胸肉",qty:3,price:49.9},{productName:"薄荷洁齿棒",qty:2,price:39.9},{productName:"牛肉能量粒",qty:1,price:42.9}], total: 272.4, status: "已完成" },
  { id: "PN20260605003", createdAt: "2026-06-05T09:30:00", customer: "张美丽", address: {name:"张美丽",phone:"13700137003",detail:"广州市天河区体育西路111号"}, items: [{productName:"鳒鱼松冻干",qty:2,price:55.0},{productName:"螺旋洁齿骨",qty:1,price:45.0}], total: 155.0, status: "已完成" },
  { id: "PN20260608004", createdAt: "2026-06-08T16:42:00", customer: "赵小明", address: {name:"赵小明",phone:"13600136004",detail:"深圳市南山区科技园南路222号"}, items: [{productName:"风干鸭肉卷",qty:2,price:45.0},{productName:"牛肉能量粒",qty:3,price:42.9}], total: 218.7, status: "已完成" },
  { id: "PN20260612005", createdAt: "2026-06-12T11:18:00", customer: "陈阿姨", address: {name:"陈阿姨",phone:"13500135005",detail:"杭州市西湖区文三路333号"}, items: [{productName:"三文鱼冻干",qty:1,price:69.9},{productName:"羊奶小圆饼",qty:4,price:29.9},{productName:"薄荷洁齿棒",qty:1,price:39.9}], total: 229.4, status: "已完成" },
  { id: "PN20260615006", createdAt: "2026-06-15T08:55:00", customer: "刘先生", address: {name:"刘先生",phone:"13400134006",detail:"成都市锦江区红星路三段444号"}, items: [{productName:"低温烘焙鸡胸肉",qty:2,price:49.9},{productName:"螺旋洁齿骨",qty:2,price:45.0}], total: 189.8, status: "已完成" },
  { id: "PN20260618007", createdAt: "2026-06-18T13:20:00", customer: "周女士", address: {name:"周女士",phone:"13300133007",detail:"武汉市洪山区珞瑜路555号"}, items: [{productName:"三文鱼冻干",qty:3,price:69.9}], total: 209.7, status: "已完成" },
  { id: "PN20260621008", createdAt: "2026-06-21T17:10:00", customer: "吴小胖", address: {name:"吴小胖",phone:"13200132008",detail:"南京市鼓楼区中山北路666号"}, items: [{productName:"风干鸭肉卷",qty:1,price:45.0},{productName:"鳒鱼松冻干",qty:2,price:55.0},{productName:"牛肉能量粒",qty:2,price:42.9}], total: 241.7, status: "已完成" },
  { id: "PN20260625009", createdAt: "2026-06-25T10:38:00", customer: "郑小白", address: {name:"郑小白",phone:"13100131009",detail:"西安市雁塔区长安南路777号"}, items: [{productName:"低温烘焙鸡胸肉",qty:1,price:49.9},{productName:"薄荷洁齿棒",qty:3,price:39.9},{productName:"羊奶小圆饼",qty:2,price:29.9}], total: 229.3, status: "已完成" },
  { id: "PN20260628010", createdAt: "2026-06-28T15:05:00", customer: "孙美丽", address: {name:"孙美丽",phone:"13000130010",detail:"长沙市岳麓区麓山南路888号"}, items: [{productName:"三文鱼冻干",qty:2,price:69.9},{productName:"螺旋洁齿骨",qty:1,price:45.0},{productName:"牛肉能量粒",qty:1,price:42.9}], total: 227.7, status: "已完成" },
  { id: "PN20260630011", createdAt: "2026-06-30T09:12:00", customer: "钱多多", address: {name:"钱多多",phone:"18900189011",detail:"重庆市渝中区解放碑999号"}, items: [{productName:"风干鸭肉卷",qty:2,price:45.0},{productName:"羊奶小圆饼",qty:3,price:29.9}], total: 179.7, status: "待配送" }
];

// ==================== STATE ====================
var currentTab = "overview";

// ==================== DATA HELPERS ====================
function getRealOrders() {
  try { var d = localStorage.getItem("lanhe-orders"); if (d) return JSON.parse(d); } catch(e) {}
  return [];
}

function getAdminProducts() {
  try { var d = localStorage.getItem("lanhe-products"); if (d) return JSON.parse(d); } catch(e) {}
  return [];
}

function getAllProductsForAdmin() {
  // Default products (same IDs as frontend)
  var defaults = [
    { id:1, name:"低温烘焙鸡胸肉", category:"鸡肉", petTypes:["dog"], price:49.9, sales:3286, spec:"150g / 袋", image:"assets/images/product-01.svg", emoji:"🍗" },
    { id:2, name:"风干鸭肉卷", category:"鸡肉", petTypes:["dog"], price:45.0, sales:2154, spec:"180g / 袋", image:"assets/images/product-02.svg", emoji:"🥩" },
    { id:3, name:"三文鱼冻干", category:"冻干", petTypes:["cat","dog"], price:69.9, sales:4521, spec:"100g / 罐", image:"assets/images/product-03.svg", emoji:"🐟" },
    { id:4, name:"鳒鱼松冻干", category:"冻干", petTypes:["cat","dog"], price:55.0, sales:1876, spec:"80g / 罐", image:"assets/images/product-04.svg", emoji:"🐠" },
    { id:5, name:"薄荷洁齿棒", category:"洁齿", petTypes:["dog"], price:39.9, sales:2934, spec:"12根 / 盒", image:"assets/images/product-05.svg", emoji:"🦷" },
    { id:6, name:"螺旋洁齿骨", category:"洁齿", petTypes:["dog"], price:45.0, sales:1632, spec:"10根 / 盒", image:"assets/images/product-06.svg", emoji:"🪪" },
    { id:7, name:"羊奶小圆饼", category:"训练奖励", petTypes:["cat","dog"], price:29.9, sales:3589, spec:"100g / 袋", image:"assets/images/product-07.svg", emoji:"🥞" },
    { id:8, name:"牛肉能量粒", category:"训练奖励", petTypes:["dog"], price:42.9, sales:2487, spec:"120g / 袋", image:"assets/images/product-08.svg", emoji:"🥩" }
  ];
  var admin = getAdminProducts();
  var nextId = 100;
  admin = admin.map(function(p, i) {
    if (!p.id) p.id = nextId + i;
    if (!p.sales) p.sales = 0;
    if (!p.emoji) p.emoji = "🥩";
    return p;
  });
  return defaults.concat(admin);
}

// ==================== STATISTICS ====================
function computeStats() {
  var allOrders = VIRTUAL_ORDERS.concat(getRealOrders());
  var allProducts = getAllProductsForAdmin();

  // Total revenue, orders, items
  var totalRevenue = 0, totalItems = 0;
  allOrders.forEach(function(o) {
    totalRevenue += o.total || 0;
    if (o.items) o.items.forEach(function(item) { totalItems += item.qty || 0; });
  });
  var totalOrders = allOrders.length;

  // Per-product stats from orders
  var orderSales = {};
  allOrders.forEach(function(o) {
    if (o.items) o.items.forEach(function(item) {
      var key = item.productName || item.productName;
      if (!orderSales[key]) orderSales[key] = { qty: 0, revenue: 0 };
      orderSales[key].qty += item.qty || 0;
      orderSales[key].revenue += (item.price || 0) * (item.qty || 0);
    });
  });

  return { totalRevenue: totalRevenue, totalOrders: totalOrders, totalItems: totalItems, orderSales: orderSales, allOrders: allOrders, allProducts: allProducts };
}

// ==================== RENDER ====================
function renderStats() {
  var stats = computeStats();
  var grid = document.getElementById("statsGrid");
  grid.innerHTML =
    '<div class="stat-card"><div class="stat-card__label">总营业额</div><div class="stat-card__value accent">¥' + stats.totalRevenue.toFixed(1) + '</div></div>' +
    '<div class="stat-card"><div class="stat-card__label">总订单数</div><div class="stat-card__value">' + stats.totalOrders + '</div></div>' +
    '<div class="stat-card"><div class="stat-card__label">售出件数</div><div class="stat-card__value">' + stats.totalItems + '</div></div>' +
    '<div class="stat-card"><div class="stat-card__label">商品种类</div><div class="stat-card__value">' + stats.allProducts.length + '</div></div>';
}

function renderSalesRanking() {
  var stats = computeStats();
  var ranking = stats.allProducts.map(function(p) {
    var orderInfo = stats.orderSales[p.name] || { qty: 0, revenue: 0 };
    return { name: p.name, category: p.category, sales: (p.sales || 0) + orderInfo.qty, revenue: orderInfo.revenue };
  });
  ranking.sort(function(a, b) { return b.sales - a.sales; });

  var icons = ["🥇","🥈","🥉"];
  var body = document.getElementById("salesRankingBody");
  body.innerHTML = ranking.map(function(item, i) {
    return '<tr><td><strong>' + (i < 3 ? icons[i] + ' ' : '#' + (i+1)) + '</strong></td><td>' + item.name + '</td><td>' + item.category + '</td><td class="num">' + item.sales + '</td><td class="num">¥' + item.revenue.toFixed(1) + '</td></tr>';
  }).join("");
}

function renderSalesDetail() {
  var stats = computeStats();
  var body = document.getElementById("salesDetailBody");
  body.innerHTML = stats.allProducts.map(function(p) {
    var orderInfo = stats.orderSales[p.name] || { qty: 0, revenue: 0 };
    var totalSales = (p.sales || 0) + orderInfo.qty;
    var totalRevenue = orderInfo.revenue;
    return '<tr><td>' + p.name + '</td><td>' + p.category + '</td><td class="num">¥' + p.price.toFixed(1) + '</td><td class="num">' + (p.sales || 0) + '</td><td class="num">' + orderInfo.qty + '</td><td class="num"><strong>' + totalSales + '</strong></td><td class="num">¥' + totalRevenue.toFixed(1) + '</td></tr>';
  }).join("");
}

function renderOrders() {
  var stats = computeStats();
  var body = document.getElementById("orderListBody");
  body.innerHTML = stats.allOrders.map(function(o) {
    var itemsHtml = o.items.map(function(item) { return item.productName + ' ×' + item.qty; }).join("<br>");
    var addrHtml = (o.address ? (o.address.name + "<br>" + o.address.phone + "<br>" + o.address.detail) : "-");
    var statusClass = o.status === "已完成" ? "status-badge--completed" : "status-badge--delivering";
    return '<tr><td style="font-size:.78rem;font-family:monospace">' + o.id + '</td><td style="font-size:.8rem;white-space:nowrap">' + o.createdAt.replace("T"," ") + '</td><td>' + o.customer + '</td><td style="font-size:.78rem;line-height:1.4">' + addrHtml + '</td><td class="order-items">' + itemsHtml + '</td><td class="num">¥' + (o.total || 0).toFixed(1) + '</td><td><span class="status-badge ' + statusClass + '">' + o.status + '</span></td></tr>';
  }).join("");
}

function renderAdminProducts() {
  var admin = getAdminProducts();
  var body = document.getElementById("adminProductsBody");
  if (admin.length === 0) {
    body.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:40px;color:#9A9A9A">暂无上架商品，前往 "上架新品" 添加</td></tr>';
    return;
  }
  body.innerHTML = admin.map(function(p) {
    var pets = (p.petTypes || []).map(function(pt) { return pt === "cat" ? "猫猫" : "狗狗"; }).join(" / ");
    return '<tr><td>' + p.name + '</td><td>' + p.category + '</td><td>' + pets + '</td><td class="num">¥' + p.price.toFixed(1) + '</td><td>' + p.spec + '</td><td class="num">' + (p.sales || 0) + '</td></tr>';
  }).join("");
}

// ==================== TAB SWITCHING ====================
function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll("[data-tab]").forEach(function(el) { el.classList.remove("active"); });
  document.querySelectorAll(".admin-section").forEach(function(el) { el.style.display = "none"; });
  var tabEl = document.querySelector('[data-tab="' + tab + '"]');
  if (tabEl) tabEl.classList.add("active");
  var section = document.getElementById("tab-" + tab);
  if (section) section.style.display = "block";
  if (tab === "overview") { renderStats(); renderSalesRanking(); renderSalesDetail(); }
  if (tab === "orders") renderOrders();
  if (tab === "products") renderAdminProducts();
}

// ==================== NEW PRODUCT ====================
function getFormData() {
  var name = document.getElementById("newName").value.trim();
  var category = document.getElementById("newCategory").value;
  var petTypes = [];
  if (document.getElementById("newPetCat").checked) petTypes.push("cat");
  if (document.getElementById("newPetDog").checked) petTypes.push("dog");
  var price = parseFloat(document.getElementById("newPrice").value);
  var spec = document.getElementById("newSpec").value.trim();
  var emoji = document.getElementById("newEmoji").value;
  var image = document.getElementById("newImage").value;
  var bullets = document.getElementById("newBullets").value.trim().split("\n").filter(function(l) { return l.trim(); });
  var ingredients = document.getElementById("newIngredients").value.trim();
  var palatability = document.getElementById("newPalatability").value.trim().split("\n").filter(function(l) { return l.trim(); });
  return { name: name, category: category, petTypes: petTypes, price: price, spec: spec, emoji: emoji, image: image, bullets: bullets, ingredients: ingredients, palatability: palatability };
}

function renderPreview() {
  var data = getFormData();
  if (!data.name) { showMsg("请至少填写商品名称"); return; }
  var area = document.getElementById("previewArea");
  area.style.display = "block";
  var grid = document.getElementById("previewGrid");
  grid.innerHTML = '<div class="preview-card"><div class="preview-card__emoji">' + data.emoji + '</div><div class="preview-card__name">' + data.name + '</div><div class="preview-card__price">¥' + (data.price || 0).toFixed(1) + '</div><div style="font-size:.7rem;color:#9A9A9A;margin-top:4px">' + data.spec + '</div><div style="font-size:.7rem;color:#6B6B6B;margin-top:2px">' + data.category + '</div></div>';
}

function saveProduct() {
  var data = getFormData();
  if (!data.name || !data.price || !data.spec) { showMsg("请填写完整信息"); return; }
  if (data.petTypes.length === 0) { showMsg("请至少选择一个适用宠物"); return; }

  var admin = getAdminProducts();
  admin.push(data);
  localStorage.setItem("lanhe-products", JSON.stringify(admin));
  showMsg("✅ 商品「" + data.name + "」已上架，刷新商城即可查看");

  // Clear form
  document.getElementById("newName").value = "";
  document.getElementById("newPrice").value = "";
  document.getElementById("newSpec").value = "";
  document.getElementById("newBullets").value = "";
  document.getElementById("newIngredients").value = "";
  document.getElementById("newPalatability").value = "";
  document.getElementById("previewArea").style.display = "none";
  renderAdminProducts();
}

function showMsg(msg) {
  var el = document.getElementById("adminToast") || (function() {
    var t = document.createElement("div");
    t.id = "adminToast";
    t.style.cssText = "position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:#2D2D2D;color:#fff;padding:12px 24px;border-radius:8px;font-size:.88rem;z-index:9999;opacity:0;transition:opacity .3s";
    document.body.appendChild(t);
    return t;
  })();
  el.textContent = msg;
  el.style.opacity = "1";
  if (window._toastTimer) clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(function() { el.style.opacity = "0"; }, 2500);
}

// ==================== INIT ====================
function init() {
  // Tab switching
  document.querySelectorAll("[data-tab]").forEach(function(el) {
    el.addEventListener("click", function() { switchTab(this.dataset.tab); });
  });
  // Preview
  document.getElementById("previewBtn").addEventListener("click", renderPreview);
  // Save
  document.getElementById("saveProductBtn").addEventListener("click", saveProduct);
  // Render initial
  switchTab("overview");
}

document.addEventListener("DOMContentLoaded", init);
