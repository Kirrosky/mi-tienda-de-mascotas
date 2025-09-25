/* app.js - gestión dinámica: productos, servicios, tienda, links, blog detail */

/* --- Helpers --- */
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

/* --- Datos por defecto (se usan si no hay localStorage) --- */
const DEFAULT_STORE_NAME = 'PetStore';
const DEFAULT_PRODUCTS = [
  {id:1,title:'Alimento Premium para Perros 3kg',price:85.00,category:'Perros',img:'images/product1.png',stock:12},
  {id:2,title:'Arena para Gatos 5kg',price:32.50,category:'Gatos',img:'images/product2.png',stock:8},
  {id:3,title:'Juguete interactivo',price:12.00,category:'Perros',img:'images/product3.png',stock:20}
];
const DEFAULT_SERVICES = [
  {id:1,name:'Peluquería',contact:'Tel: +57 300 000 0000',notes:'Cortes y baños'},
  {id:2,name:'Consulta nutricional',contact:'contacto@petstore.com',notes:'Planes de alimentación personalizados'}
];
const DEFAULT_POSTS = [
  {id:1,slug:'elegir-alimento-perro',title:'Cómo elegir el mejor alimento para tu perro',content:'Contenido completo guía 1...'},
  {id:2,slug:'cuidados-gatos-interior',title:'Cuidados básicos para gatos de interior',content:'Contenido completo guía 2...'}
];

/* --- Storage helpers --- */
function load(key, fallback){ try{ const v=localStorage.getItem(key); return v?JSON.parse(v):fallback }catch(e){return fallback} }
function save(key, val){ localStorage.setItem(key, JSON.stringify(val)); }

/* --- App state --- */
let products = load('ps_products', DEFAULT_PRODUCTS);
let services = load('ps_services', DEFAULT_SERVICES);
let posts = load('ps_posts', DEFAULT_POSTS);
let storeName = load('ps_storeName', DEFAULT_STORE_NAME);
let cart = load('ps_cart', []);

/* --- Utilities ID generator --- */
const nextId = arr => arr.length? Math.max(...arr.map(x=>x.id))+1 : 1;

/* --- Rendering products into container --- */
function renderProducts(targetId, list=products){
  const container = document.getElementById(targetId);
  if(!container) return;
  // fade out/in
  container.classList.add('fade-exit');
  setTimeout(()=> {
    container.innerHTML='';
    list.forEach(p=>{
      const div = document.createElement('div'); div.className='card';
      div.innerHTML = `
        <img src="${p.img}" alt="${p.title}">
        <h4>${p.title}</h4>
        <div class="muted">${p.category}</div>
        <div style="margin-top:8px;display:flex;justify-content:space-between;align-items:center">
          <div class="price">$${Number(p.price).toFixed(2)}</div>
          <div class="ctrls">
            <button class="btn" onclick="addToCart(${p.id})">Añadir</button>
            <button class="icon-btn" onclick="openEditProduct(${p.id})" title="Editar">✎</button>
            <button class="icon-btn" onclick="removeProduct(${p.id})" title="Eliminar">🗑</button>
          </div>
        </div>
      `;
      container.appendChild(div);
    });
    container.classList.remove('fade-exit');
  }, 120);
}

/* --- Cart simple --- */
function addToCart(id){
  const p = products.find(x=>x.id===id);
  if(!p) return alert('Producto no encontrado');
  const it = cart.find(c=>c.id===id);
  if(it) it.qty++;
  else cart.push({id:p.id,title:p.title,price:p.price,qty:1,img:p.img});
  save('ps_cart', cart);
  updateCartUI();
}
function updateCartUI(){
  const itemsDiv = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  if(!itemsDiv || !totalEl) return;
  itemsDiv.innerHTML='';
  let total = 0;
  cart.forEach(i=>{
    total += i.price*i.qty;
    const d=document.createElement('div'); d.className='cart-item';
    d.innerHTML = `<img src="${i.img}" class="small"><div style="flex:1"><div>${i.title}</div><div class="muted">$${i.price} x ${i.qty}</div></div><div class="qty"><button onclick="changeQty(${i.id},-1)">-</button><span>${i.qty}</span><button onclick="changeQty(${i.id},1)">+</button></div>`;
    itemsDiv.appendChild(d);
  });
  totalEl.textContent = 'Total: $' + total.toFixed(2);
  const toggleBtn = document.getElementById('toggle-cart');
  if(toggleBtn) toggleBtn.textContent = `Carrito (${cart.reduce((s,i)=>s+i.qty,0)})`;
}
function changeQty(id,delta){
  const it = cart.find(i=>i.id===id);
  if(!it) return;
  it.qty+=delta; if(it.qty<=0) cart = cart.filter(i=>i.id!==id);
  save('ps_cart', cart);
  updateCartUI();
}

/* --- Product CRUD (admin actions) --- */
function addProductFromForm(){
  const title = $('#admin-prod-title').value.trim();
  const price = parseFloat($('#admin-prod-price').value);
  const category = $('#admin-prod-cat').value.trim() || 'General';
  const img = $('#admin-prod-img').value.trim() || 'images/product1.png';
  if(!title || isNaN(price)) return alert('Título y precio válidos son requeridos.');
  const id = nextId(products);
  products.push({id,title,price,category,img,stock:10});
  save('ps_products', products);
  renderProducts('products-grid');
  renderProducts('featured');
  $('#admin-prod-title').value = ''; $('#admin-prod-price').value = '';
}
function removeProduct(id){
  if(!confirm('Eliminar producto?')) return;
  products = products.filter(p=>p.id!==id);
  save('ps_products', products);
  renderProducts('products-grid');
  renderProducts('featured');
}
function openEditProduct(id){
  const p = products.find(x=>x.id===id);
  if(!p) return alert('Producto no encontrado');
  // populate admin fields and change button to save
  $('#admin-prod-title').value = p.title;
  $('#admin-prod-price').value = p.price;
  $('#admin-prod-cat').value = p.category;
  $('#admin-prod-img').value = p.img;
  $('#admin-save-btn').dataset.editId = id;
  $('#admin-save-btn').textContent = 'Guardar cambios';
  $('#admin-panel').scrollIntoView({behavior:'smooth'});
}
function saveEdit(){
  const editId = parseInt($('#admin-save-btn').dataset.editId || 0);
  if(editId){
    const p = products.find(x=>x.id===editId);
    p.title = $('#admin-prod-title').value.trim();
    p.price = parseFloat($('#admin-prod-price').value);
    p.category = $('#admin-prod-cat').value.trim();
    p.img = $('#admin-prod-img').value.trim();
    save('ps_products', products);
    renderProducts('products-grid');
    renderProducts('featured');
    delete $('#admin-save-btn').dataset.editId;
    $('#admin-save-btn').textContent = 'Agregar producto';
    $('#admin-prod-title').value=''; $('#admin-prod-price').value=''; $('#admin-prod-cat').value=''; $('#admin-prod-img').value='';
  } else addProductFromForm();
}

/* --- Services CRUD --- */
function renderServices(){
  const c = document.getElementById('services-list');
  if(!c) return;
  c.innerHTML='';
  services.forEach(s=>{
    const d = document.createElement('div'); d.className='service-card';
    d.innerHTML = `<div><strong>${s.name}</strong><div class="muted">${s.contact} · ${s.notes||''}</div></div>
      <div class="ctrls">
        <button class="icon-btn" onclick="openEditService(${s.id})">✎</button>
        <button class="icon-btn" onclick="removeService(${s.id})">🗑</button>
      </div>`;
    c.appendChild(d);
  });
}
function addServiceFromForm(){
  const name = $('#svc-name').value.trim();
  const contact = $('#svc-contact').value.trim();
  const notes = $('#svc-notes').value.trim();
  if(!name || !contact) return alert('Nombre y contacto requeridos.');
  const id = nextId(services);
  services.push({id,name,contact,notes});
  save('ps_services', services);
  renderServices();
  $('#svc-name').value=''; $('#svc-contact').value=''; $('#svc-notes').value='';
}
function openEditService(id){
  const s = services.find(x=>x.id===id);
  if(!s) return;
  $('#svc-name').value = s.name;
  $('#svc-contact').value = s.contact;
  $('#svc-notes').value = s.notes||'';
  $('#svc-save-btn').dataset.editId = id;
  $('#svc-save-btn').textContent = 'Guardar servicio';
}
function saveService(){
  const editId = parseInt($('#svc-save-btn').dataset.editId || 0);
  if(editId){
    const s = services.find(x=>x.id===editId);
    s.name = $('#svc-name').value.trim();
    s.contact = $('#svc-contact').value.trim();
    s.notes = $('#svc-notes').value.trim();
    save('ps_services', services);
    renderServices();
    delete $('#svc-save-btn').dataset.editId;
    $('#svc-save-btn').textContent = 'Agregar servicio';
    $('#svc-name').value=''; $('#svc-contact').value=''; $('#svc-notes').value='';
  } else addServiceFromForm();
}
function removeService(id){
  if(!confirm('Eliminar servicio?')) return;
  services = services.filter(s=>s.id!==id);
  save('ps_services', services);
  renderServices();
}

/* --- Store rename and text edit --- */
function setStoreName(name){
  storeName = name || DEFAULT_STORE_NAME;
  save('ps_storeName', storeName);
  $$('.brand div > div:first-child').forEach(el => el.textContent = storeName);
}
function enableStoreRename(){
  const newName = prompt('Nuevo nombre de tienda:', storeName);
  if(newName) setStoreName(newName.trim());
}

/* --- Links validator --- */
function checkLinks(){
  const anchors = Array.from(document.querySelectorAll('a'));
  const results = anchors.map(a=>({href:a.getAttribute('href'), text:a.textContent.trim()}));
  results.forEach(r=>{
    if(!r.href || r.href==='') console.warn('Enlace vacío o inválido:', r);
  });
}

/* --- Blog detail page render: blog-detail.html?id=ID --- */
function renderBlogDetail(){
  const el = document.getElementById('blog-detail');
  if(!el) return;
  const params = new URLSearchParams(location.search);
  const id = parseInt(params.get('id') || 0);
  const post = posts.find(p=>p.id===id);
  if(!post) { el.innerHTML = '<p>Entrada no encontrada.</p>'; return; }
  el.innerHTML = `<h1>${post.title}</h1><div class="muted">Guía completa</div><article>${post.content}</article>`;
}

/* --- render blog list with links to blog-detail.html?id=... --- */
function renderBlogList(){
  const c = document.getElementById('blog-list');
  if(!c) return;
  c.innerHTML = '';
  posts.forEach(p=>{
    const d = document.createElement('div'); d.className='blog-card';
    d.innerHTML = `<h4>${p.title}</h4><p class="muted">${p.excerpt||''}</p><a href="blog-detail.html?id=${p.id}">Leer guía completa</a>`;
    c.appendChild(d);
  });
}

/* --- helper: ensure no broken anchors (basic) --- */
function fixRelativeLinks(){
  $$('a').forEach(a=>{
    const href = a.getAttribute('href');
    if(!href) return;
    if(href.startsWith('http') || href.startsWith('#') || href.includes('.html')) return;
    // make relative path safe - leave as-is for now
  });
}

/* --- Init on DOM ready --- */
document.addEventListener('DOMContentLoaded', ()=>{
  // set store name on page
  setStoreName(storeName);

  // render initial UI
  renderProducts('featured');
  renderProducts('products-grid');
  renderServices();
  renderBlogList();
  updateCartUI();
  checkLinks();
  renderBlogDetail();
});
