// app.js - adapted from Petstore-site demo
const products = [
  {id:1,title:'Alimento Premium para Perros 3kg',price:85.00,category:'Perros',img:'images/product1.png',stock:12},
  {id:2,title:'Arena para Gatos 5kg',price:32.50,category:'Gatos',img:'images/product2.png',stock:8},
  {id:3,title:'Juguete interactivo',price:12.00,category:'Perros',img:'images/product3.png',stock:20}
];

const posts = [
  {id:1,title:'Cómo elegir el mejor alimento para tu perro',excerpt:'Guía práctica basada en edad y actividad.'},
  {id:2,title:'Cuidados básicos para gatos de interior',excerpt:'Limpieza, juego y nutrición.'}
];

function renderProducts(target, list){
  const container = document.getElementById(target);
  if(!container) return;
  container.innerHTML = '';
  list.forEach(p=>{
    const div = document.createElement('div'); div.className='card';
    div.innerHTML = `
      <img src="${p.img}" alt="Imagen ${p.title}">
      <h4>${p.title}</h4>
      <div class="muted">${p.category}</div>
      <div style="margin-top:8px;display:flex;justify-content:space-between;align-items:center">
        <div class="price">$${p.price.toFixed(2)}</div>
        <button class="btn" onclick="addToCart(${p.id})">Añadir</button>
      </div>
    `;
    container.appendChild(div);
  })
}

// initial render when DOM loaded
document.addEventListener('DOMContentLoaded', ()=>{
  renderProducts('featured', products);
  renderProducts('products-grid', products);

  const blogList = document.getElementById('blog-list');
  if(blogList){
    posts.forEach(p=>{
      const el = document.createElement('div'); el.className='blog-card';
      el.innerHTML = `<h4>${p.title}</h4><p class="muted">${p.excerpt}</p><a href="#">Leer más</a>`;
      blogList.appendChild(el);
    });
  }

  const searchBtn = document.getElementById('search-btn');
  if(searchBtn){
    searchBtn.addEventListener('click', ()=>{
      const q = document.getElementById('search').value.toLowerCase();
      const filtered = products.filter(p=>p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
      renderProducts('products-grid', filtered);
    });
  }

  document.getElementById('toggle-cart')?.addEventListener('click', ()=>{
    const panel = document.getElementById('cart');
    if(panel.style.display==='none'){ panel.style.display='block'; panel.setAttribute('aria-hidden','false'); } else { panel.style.display='none'; panel.setAttribute('aria-hidden','true'); }
  });

  document.getElementById('checkout-btn')?.addEventListener('click', ()=>{
    if(cart.length===0){ alert('El carrito está vacío.'); return; }
    const payload = {items:cart,total:cart.reduce((s,i)=>s+i.price*i.qty,0)};
    console.log('Checkout payload',payload);
    alert('Simulación de pago. Reemplaza este flujo por una pasarela real.');
  });

  document.getElementById('contact-form')?.addEventListener('submit', (e)=>{
    e.preventDefault();
    const data = {name:document.getElementById('name').value,email:document.getElementById('email').value,message:document.getElementById('message').value};
    console.log('Contacto',data);
    alert('Mensaje enviado (simulación).');
    e.target.reset();
  });

  document.addEventListener('keydown', (e)=>{ if(e.key==='c'){ document.getElementById('toggle-cart')?.click(); } });

  updateCartUI();
});

// cart logic
let cart = [];
function addToCart(id){
  const p = products.find(x=>x.id===id);
  const item = cart.find(c=>c.id===id);
  if(item){ item.qty += 1; } else { cart.push({id:p.id,title:p.title,price:p.price,qty:1,img:p.img}); }
  updateCartUI();
}

function updateCartUI(){
  const itemsDiv = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  const toggleBtn = document.getElementById('toggle-cart');
  if(!itemsDiv || !totalEl) return;
  let total = 0; itemsDiv.innerHTML='';
  cart.forEach(i=>{
    total += i.price*i.qty;
    const d = document.createElement('div'); d.className='cart-item';
    d.innerHTML = `
      <img src="${i.img}" alt="${i.title}" class="small">
      <div style="flex:1">
        <div style="font-size:0.95rem">${i.title}</div>
        <div class="muted">$${i.price.toFixed(2)} x ${i.qty}</div>
      </div>
      <div class="qty">
        <button onclick="changeQty(${i.id},-1)" aria-label="Disminuir">-</button>
        <span>${i.qty}</span>
        <button onclick="changeQty(${i.id},1)" aria-label="Aumentar">+</button>
      </div>
    `;
    itemsDiv.appendChild(d);
  });
  totalEl.textContent = 'Total: $' + total.toFixed(2);
  if(toggleBtn) toggleBtn.textContent = `Carrito (${cart.reduce((s,i)=>s+i.qty,0)})`;
}

function changeQty(id,delta){
  const it = cart.find(i=>i.id===id);
  if(!it) return;
  it.qty += delta; if(it.qty<=0) cart = cart.filter(i=>i.id!==id);
  updateCartUI();
}
