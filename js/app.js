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
      <button class="btn" onclick="addToCart(${p.id})">Añadir al carrito</button>
      <button class="link-like" onclick="editProduct(${p.id})">✏️ Editar</button>
      <button class="link-like" onclick="deleteProduct(${p.id})">🗑️ Eliminar</button>
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
// INIT
// =======================
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderServices();
  renderCart();
  renderStoreName();
});
