// ==========================
// Productos iniciales
// ==========================
let products = [
  {
    id: 1,
    title: "Comida para perros",
    price: 25000,
    category: "Alimento",
    img: "images/comida-perros.jpg"
  },
  {
    id: 2,
    title: "Juguete para gatos",
    price: 15000,
    category: "Juguetes",
    img: "images/juguete-gatos.jpg"
  },
  {
    id: 3,
    title: "Pecera pequeña",
    price: 80000,
    category: "Accesorios",
    img: "images/pecera.jpg"
  }
];

let services = [];
let editIndex = null;

// ==========================
// Renderizar productos
// ==========================
function renderProducts() {
  const grid = document.getElementById("products-grid");
  if (!grid) return;

  grid.innerHTML = "";
  products.forEach((prod, idx) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${prod.img}" alt="${prod.title}">
      <h3>${prod.title}</h3>
      <p><strong>$${prod.price.toLocaleString()}</strong></p>
      <p class="muted">${prod.category}</p>
      <button class="btn small" onclick="editProduct(${idx})">Editar</button>
      <button class="btn small danger" onclick="deleteProduct(${idx})">Eliminar</button>
    `;
    grid.appendChild(card);
  });
}

// ==========================
// Guardar o editar producto
// ==========================
function saveEdit() {
  const title = document.getElementById("admin-prod-title").value.trim();
  const price = parseInt(document.getElementById("admin-prod-price").value.trim());
  const cat = document.getElementById("admin-prod-cat").value.trim();
  const img = document.getElementById("admin-prod-img").value.trim();

  if (!title || !price || !cat || !img) {
    alert("Completa todos los campos.");
    return;
  }

  if (editIndex === null) {
    products.push({ id: Date.now(), title, price, category: cat, img });
  } else {
    products[editIndex] = { ...products[editIndex], title, price, category: cat, img };
    editIndex = null;
    document.getElementById("admin-save-btn").innerText = "Agregar producto";
  }

  document.getElementById("admin-prod-title").value = "";
  document.getElementById("admin-prod-price").value = "";
  document.getElementById("admin-prod-cat").value = "";
  document.getElementById("admin-prod-img").value = "";

  renderProducts();
}

// ==========================
// Editar producto
// ==========================
function editProduct(index) {
  const prod = products[index];
  document.getElementById("admin-prod-title").value = prod.title;
  document.getElementById("admin-prod-price").value = prod.price;
  document.getElementById("admin-prod-cat").value = prod.category;
  document.getElementById("admin-prod-img").value = prod.img;
  editIndex = index;
  document.getElementById("admin-save-btn").innerText = "Guardar cambios";
}

// ==========================
// Eliminar producto
// ==========================
function deleteProduct(index) {
  if (confirm("¿Eliminar este producto?")) {
    products.splice(index, 1);
    renderProducts();
  }
}

// ==========================
// Servicios
// ==========================
function saveService() {
  const name = document.getElementById("svc-name").value.trim();
  const contact = document.getElementById("svc-contact").value.trim();
  const notes = document.getElementById("svc-notes").value.trim();

  if (!name || !contact) {
    alert("Completa al menos nombre y contacto.");
    return;
  }

  services.push({ name, contact, notes });
  renderServices();

  document.getElementById("svc-name").value = "";
  document.getElementById("svc-contact").value = "";
  document.getElementById("svc-notes").value = "";
}

function renderServices() {
  const list = document.getElementById("services-list");
  if (!list) return;

  list.innerHTML = "";
  services.forEach((svc, idx) => {
    const div = document.createElement("div");
    div.className = "service-card";
    div.innerHTML = `
      <strong>${svc.name}</strong><br>
      <span>${svc.contact}</span><br>
      <small>${svc.notes || ""}</small><br>
      <button class="btn small danger" onclick="deleteService(${idx})">Eliminar</button>
    `;
    list.appendChild(div);
  });
}

function deleteService(index) {
  services.splice(index, 1);
  renderServices();
}

// ==========================
// Renombrar tienda
// ==========================
function enableStoreRename() {
  const newName = prompt("Nuevo nombre de la tienda:");
  if (newName) {
    document.querySelectorAll(".brand div div:first-child, footer strong")
      .forEach(el => el.innerText = newName);
  }
}

// ==========================
// Panel oculto con Alt + A
// ==========================
document.addEventListener("keydown", (e) => {
  if (e.altKey && e.key === "a") {
    document.getElementById("admin-panel").classList.toggle("show");
  }
});

// ==========================
// Inicializar
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderServices();
});
