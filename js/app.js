/* =======================
   PETSTORE APP.JS
======================= */

// =======================
// DATA INICIAL
// =======================
let products = JSON.parse(localStorage.getItem("products")) || [
  {
    id: 1,
    title: "Comida para perros",
    price: 25000,
    category: "Alimento",
    img: "images/product1.png"
  },
  {
    id: 2,
    title: "Juguete para gatos",
    price: 15000,
    category: "Juguetes",
    img: "images/product2.png"
  },
  {
    id: 3,
    title: "Cama para mascotas",
    price: 55000,
    category: "Accesorios",
    img: "images/product3.png"
  }
];

let services = JSON.parse(localStorage.getItem("services")) || [
  { name: "Veterinaria 24h", contact: "3001234567", notes: "Cra 45 #10-12" },
  { name: "Peluquería canina", contact: "3109876543", notes: "Calle 12 #34-56" }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let storeName = localStorage.getItem("storeName") || "PetStore";

// =======================
// RENDER FUNCIONES
// =======================
// Modify renderProducts function to include admin-only class
function renderProducts() {
  const grid = document.getElementById("products-grid");
  if (!grid) return;
  grid.innerHTML = "";
  products.forEach((p) => {
    const card = document.createElement("div");
    card.className = "product-card fade-in";
    card.innerHTML = `
      <img src="${p.img}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p><strong>$${p.price.toLocaleString()}</strong></p>
      <small class="muted">${p.category}</small>
      <button class="btn" onclick="addToCart(${p.id})">Add to Cart</button>
      <button class="link-like admin-only" onclick="editProduct(${p.id})" style="display: none;">✏️ Editar</button>
      <button class="link-like admin-only" onclick="deleteProduct(${p.id})" style="display: none;">🗑️ Eliminar</button>
    `;
    grid.appendChild(card);
  });
}

function renderServices() {
  const list = document.getElementById("services-list");
  if (!list) return;
  list.innerHTML = "";
  services.forEach((s, idx) => {
    const div = document.createElement("div");
    div.className = "service-card fade-in";
    div.innerHTML = `
      <strong>${s.name}</strong><br>
      <span class="muted">${s.contact}</span><br>
      <em>${s.notes}</em><br>
      <button class="link-like" onclick="deleteService(${idx})">Eliminar</button>
    `;
    list.appendChild(div);
  });
}

function renderCart() {
  const btn = document.getElementById("toggle-cart");
  if (!btn) return;
  btn.textContent = `Carrito (${cart.length})`;
}

function renderStoreName() {
  const brandName = document.querySelector(".brand div div:first-child");
  if (brandName) {
    brandName.textContent = storeName;
  }
}

// =======================
// CRUD PRODUCTOS
// =======================
function addToCart(id) {
  const product = products.find((p) => p.id === id);
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function saveEdit() {
  const title = document.getElementById("admin-prod-title").value;
  const price = parseFloat(document.getElementById("admin-prod-price").value);
  const cat = document.getElementById("admin-prod-cat").value;
  const img = document.getElementById("admin-prod-img").value;

  if (!title || !price || !cat || !img) {
    alert("Completa todos los campos");
    return;
  }

  const newProd = {
    id: Date.now(),
    title,
    price,
    category: cat,
    img
  };

  products.push(newProd);
  localStorage.setItem("products", JSON.stringify(products));
  renderProducts();
  clearProductForm();
}

function editProduct(id) {
  const p = products.find((p) => p.id === id);
  if (!p) return;

  document.getElementById("admin-prod-title").value = p.title;
  document.getElementById("admin-prod-price").value = p.price;
  document.getElementById("admin-prod-cat").value = p.category;
  document.getElementById("admin-prod-img").value = p.img;

  // eliminar el producto viejo y permitir guardar como nuevo
  products = products.filter((x) => x.id !== id);
  localStorage.setItem("products", JSON.stringify(products));
  renderProducts();
}

function deleteProduct(id) {
  if (!confirm("¿Seguro que quieres eliminar este producto?")) return;
  products = products.filter((p) => p.id !== id);
  localStorage.setItem("products", JSON.stringify(products));
  renderProducts();
}

function clearProductForm() {
  document.getElementById("admin-prod-title").value = "";
  document.getElementById("admin-prod-price").value = "";
  document.getElementById("admin-prod-cat").value = "";
  document.getElementById("admin-prod-img").value = "";
}

// =======================
// CRUD SERVICIOS
// =======================
function saveService() {
  const name = document.getElementById("svc-name").value;
  const contact = document.getElementById("svc-contact").value;
  const notes = document.getElementById("svc-notes").value;

  if (!name || !contact) {
    alert("Falta nombre o contacto");
    return;
  }

  services.push({ name, contact, notes });
  localStorage.setItem("services", JSON.stringify(services));
  renderServices();

  document.getElementById("svc-name").value = "";
  document.getElementById("svc-contact").value = "";
  document.getElementById("svc-notes").value = "";
}

function deleteService(idx) {
  if (!confirm("¿Seguro que quieres eliminar este servicio?")) return;
  services.splice(idx, 1);
  localStorage.setItem("services", JSON.stringify(services));
  renderServices();
}

// =======================
// RENOMBRAR TIENDA
// =======================
function enableStoreRename() {
  const newName = prompt("Nuevo nombre para la tienda:", storeName);
  if (newName) {
    storeName = newName;
    localStorage.setItem("storeName", storeName);
    renderStoreName();
  }
}
// =======================
// ADMIN MODE (Alt+A)
// =======================

// Admin mode toggle
let adminMode = false;

// Listen for Alt+A key combination
document.addEventListener('keydown', function(e) {
  if (e.altKey && e.key === 'a') {
    e.preventDefault();
    adminMode = !adminMode;
    toggleAdminElements();
    
    // Show notification
    const notification = adminMode ? 'Admin Mode Activated' : 'Admin Mode Deactivated';
    showNotification(notification);
  }
});

// Toggle admin elements visibility
function toggleAdminElements() {
  const adminElements = document.querySelectorAll('.admin-only');
  adminElements.forEach(element => {
    if (adminMode) {
      element.style.display = 'inline-block';
    } else {
      element.style.display = 'none';
    }
  });
  
  // Toggle admin panel
  const adminPanel = document.getElementById('admin-panel');
  if (adminPanel) {
    adminPanel.style.display = adminMode ? 'block' : 'none';
  }
}

// Show notification function
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'admin-notification';
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 2000);
}
// =======================
// INIT
// =======================
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderServices();
  renderCart();
  renderStoreName();
});
// app.js
// Add complete shopping cart functionality

let cartOpen = false;

// Enhanced cart functions
function addToCart(id) {
  const product = products.find((p) => p.id === id);
  if (product) {
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    showCartNotification(product);
    updateCartPopup();
  }
}

// Show cart notification when item added
function showCartNotification(product) {
  const notification = document.createElement('div');
  notification.className = 'cart-add-notification';
  notification.innerHTML = `
    <div class="notification-content">
      <strong>Added to cart!</strong>
      <p>${product.title} - $${product.price.toLocaleString()}</p>
    </div>
  `;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Toggle cart modal
function toggleCart() {
  cartOpen = !cartOpen;
  const modal = document.getElementById('cart-modal');
  if (cartOpen) {
    renderCartModal();
    modal.classList.add('active');
  } else {
    modal.classList.remove('active');
  }
}

// Render cart modal content
function renderCartModal() {
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  
  cartItems.innerHTML = '';
  let total = 0;
  
  cart.forEach((item, index) => {
    total += item.price;
    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';
    itemDiv.innerHTML = `
      <img src="${item.img}" alt="${item.title}">
      <div class="cart-item-details">
        <div class="cart-item-title">${item.title}</div>
        <div class="cart-item-price">$${item.price.toLocaleString()}</div>
      </div>
      <button class="remove-item" onclick="removeFromCart(${index})">×</button>
    `;
    cartItems.appendChild(itemDiv);
  });
  
  cartTotal.textContent = `$${total.toLocaleString()}`;
  
  // Update payment section visibility
  const paymentSection = document.getElementById('payment-section');
  if (cart.length > 0) {
    paymentSection.style.display = 'block';
  } else {
    paymentSection.style.display = 'none';
    cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
  }
}

// Remove item from cart
function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  renderCartModal();
  updateCartPopup();
}

// Process checkout
function processCheckout() {
  const email = document.getElementById('customer-email').value;
  const receipt = document.getElementById('payment-receipt').files[0];
  
  if (!email) {
    alert('Please enter your email address');
    return;
  }
  
  if (!receipt) {
    alert('Please upload your payment receipt');
    return;
  }
  
  // Simulate order processing
  alert(`Order confirmed!\n\nTotal: $${calculateTotal()}\nInvoice will be sent to: ${email}\n\nThank you for your purchase!`);
  
  // Clear cart
  cart = [];
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  toggleCart();
  updateCartPopup();
  
  // Reset form
  document.getElementById('customer-email').value = '';
  document.getElementById('payment-receipt').value = '';
}

// Calculate total
function calculateTotal() {
  return cart.reduce((sum, item) => sum + item.price, 0).toLocaleString();
}

// Update floating cart popup
function updateCartPopup() {
  const popup = document.getElementById('floating-cart-popup');
  const count = document.getElementById('popup-cart-count');
  const total = document.getElementById('popup-cart-total');
  
  if (cart.length > 0) {
    popup.style.display = 'flex';
    count.textContent = cart.length;
    total.textContent = `$${calculateTotal()}`;
  } else {
    popup.style.display = 'none';
  }
}

// Initialize cart modal on page load
document.addEventListener("DOMContentLoaded", () => {
  // Existing initialization...
  
  // Add cart modal HTML to body
  if (!document.getElementById('cart-modal')) {
    const cartModalHTML = `
      <div id="cart-modal" class="cart-modal">
        <div class="cart-content">
          <div class="cart-header">
            <h2>Shopping Cart</h2>
            <button class="cart-close" onclick="toggleCart()">×</button>
          </div>
          <div id="cart-items"></div>
          <div class="cart-total">
            <h3>Total:</h3>
            <span id="cart-total" class="total-price">$0</span>
          </div>
          <div id="payment-section" style="display: none;">
            <hr>
            <h3>Payment Information</h3>
            <div class="payment-info">
              <p><strong>Pay with Nequi to:</strong></p>
              <p class="nequi-number">315 854 7707</p>
              <p class="muted">Send exact amount shown above</p>
            </div>
            <div class="form-group">
              <label for="customer-email">Email for invoice:</label>
              <input type="email" id="customer-email" class="input" placeholder="your@email.com" required>
            </div>
            <div class="form-group">
              <label for="payment-receipt">Upload payment receipt:</label>
              <input type="file" id="payment-receipt" class="input" accept="image/*,.pdf" required>
            </div>
            <button class="btn checkout-btn" onclick="processCheckout()">Complete Purchase</button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', cartModalHTML);
  }
  
  // Add floating cart popup
  if (!document.getElementById('floating-cart-popup')) {
    const popupHTML = `
      <div id="floating-cart-popup" class="floating-cart-popup" onclick="toggleCart()">
        <div class="popup-icon">🛒</div>
        <div class="popup-info">
          <span id="popup-cart-count">0</span> items
          <div class="popup-total">Total: <span id="popup-cart-total">$0</span></div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', popupHTML);
  }
  
  // Update cart button to open modal
  const cartBtn = document.getElementById('toggle-cart');
  if (cartBtn) {
    cartBtn.onclick = toggleCart;
  }
  
  updateCartPopup();
});
