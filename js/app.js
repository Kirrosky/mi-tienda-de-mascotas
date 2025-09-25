// Productos iniciales
let products = [
  { id: 1, title: "Comida para perros", price: 12000, category: "Perros", img: "images/product1.png" },
  { id: 2, title: "Juguete para gatos", price: 8000, category: "Gatos", img: "images/product2.png" },
  { id: 3, title: "Jaula para aves", price: 35000, category: "Aves", img: "images/product3.png" },
];

const productsGrid = document.getElementById("products-grid");
const cartToggleBtn = document.getElementById("toggle-cart");
let cart = [];

// Render de productos
function renderProducts() {
  if (!productsGrid) return;
  productsGrid.innerHTML = "";
  products.forEach(p => {
    const card = document.createElement("article");
    card.classList.add("card");
    card.innerHTML = `
      <img src="${p.img}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p>$${p.price.toLocaleString("es-CO")}</p>
      <button onclick="addToCart(${p.id})">Agregar al carrito</button>
    `;
    productsGrid.appendChild(card);
  });
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  cart.push(product);
  updateCartCount();
}

function updateCartCount() {
  if (cartToggleBtn) {
    cartToggleBtn.textContent = `Carrito (${cart.length})`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
});
