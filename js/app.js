// --- Inicialización ---
let productos = JSON.parse(localStorage.getItem("productos")) || [];
let servicios = JSON.parse(localStorage.getItem("servicios")) || [];

renderProducts();
renderServices();

// --- Guardar o editar producto ---
function saveEdit() {
  const title = document.getElementById("admin-prod-title").value.trim();
  const price = document.getElementById("admin-prod-price").value.trim();
  const cat = document.getElementById("admin-prod-cat").value.trim();
  const img = document.getElementById("admin-prod-img").value.trim();

  if (!title || !price || !cat || !img) {
    alert("Completa todos los campos");
    return;
  }

  // Crear producto
  const newProd = {
    id: Date.now(),
    title,
    price,
    cat,
    img
  };

  // Añadir a la lista
  productos.push(newProd);
  localStorage.setItem("productos", JSON.stringify(productos));

  // Limpiar inputs
  document.getElementById("admin-prod-title").value = "";
  document.getElementById("admin-prod-price").value = "";
  document.getElementById("admin-prod-cat").value = "";
  document.getElementById("admin-prod-img").value = "";

  renderProducts();
}

// --- Renderizar productos ---
function renderProducts() {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  grid.innerHTML = "";
  productos.forEach(prod => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${prod.img}" alt="${prod.title}" style="max-width:100%">
      <h3>${prod.title}</h3>
      <p>Categoría: ${prod.cat}</p>
      <p><strong>$${prod.price}</strong></p>
      <button onclick="removeProduct(${prod.id})">Eliminar</button>
    `;

    grid.appendChild(card);
  });

  // Actualizar contador carrito en header
  const cartBtn = document.getElementById("toggle-cart");
  if (cartBtn) {
    cartBtn.innerText = `Carrito (${productos.length})`;
  }
}

// --- Eliminar producto ---
function removeProduct(id) {
  productos = productos.filter(p => p.id !== id);
  localStorage.setItem("productos", JSON.stringify(productos));
  renderProducts();
}

// --- Renombrar tienda ---
function enableStoreRename() {
  const newName = prompt("Nuevo nombre de la tienda:");
  if (newName) {
    document.querySelector(".brand .logo").innerText = newName[0].toUpperCase();
    document.querySelector(".brand div div").innerText = newName;
  }
}

// --- Guardar servicio ---
function saveService() {
  const nombre = document.getElementById("nombre-svc").value.trim();
  const contacto = document.getElementById("svc-contact").value.trim();
  const notas = document.getElementById("svc-notes").value.trim();

  if (!nombre || !contacto) {
    alert("El nombre y contacto del servicio son obligatorios");
    return;
  }

  const newService = {
    id: Date.now(),
    name: nombre,
    contact: contacto,
    notes: notas
  };

  servicios.push(newService);
  localStorage.setItem("servicios", JSON.stringify(servicios));

  document.getElementById("nombre-svc").value = "";
  document.getElementById("svc-contact").value = "";
  document.getElementById("svc-notes").value = "";

  renderServices();
}

// --- Renderizar servicios ---
function renderServices() {
  const list = document.getElementById("services-list");
  if (!list) return;

  list.innerHTML = "";
  servicios.forEach(svc => {
    const div = document.createElement("div");
    div.className = "service-card";
    div.innerHTML = `
      <p><strong>${svc.name}</strong> - ${svc.contact}</p>
      <p>${svc.notes || ""}</p>
    `;
    list.appendChild(div);
  });
}
