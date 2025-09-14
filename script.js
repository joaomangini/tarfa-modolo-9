// === Dados de exemplo (9 cursos) ===
const products = [
   { id: 1, name: "Python: Do Zero ao Avançado", price: 149.90, image: "https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg" },
  { id: 2, name: "JavaScript Moderno (ES6+)", price: 129.90, image: "https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" },
  { id: 3, name: "SQL e Modelagem de Dados", price: 99.90, image: "https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original.svg" },
  { id: 4, name: "APIs com Node.js", price: 119.90, image: "https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg" },
  { id: 5, name: "Dev Web Frontend (HTML/CSS)", price: 89.90, image: "https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original.svg" },
  { id: 6, name: "Machine Learning com Python", price: 179.90, image: "https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg" },
  { id: 7, name: "Docker e Containers", price: 109.90, image: "https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original.svg" },
  { id: 8, name: "Cloud Essentials (AWS/Azure)", price: 139.90, image: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" },
  { id: 9, name: "Segurança & LGPD para Devs", price: 89.90, image: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" },

];

let cart = []; // itens: { productId, qty }

// === ELEMENTOS DOM ===
const productGrid = document.getElementById("productGrid");
const cartCount = document.getElementById("cartCount");
const btnCart = document.getElementById("btnCart");
const cartDrawer = document.getElementById("cartDrawer");
const cartItemsTbody = document.getElementById("cartItems");
const totalEl = document.getElementById("total");

const sideMenu = document.getElementById("sideMenu");
const openMenu = document.getElementById("openMenu");
const closeMenu = document.getElementById("closeMenu");
const closeCart = document.getElementById("closeCart");
const checkoutBtn = document.getElementById("checkout");
const clearCartBtn = document.getElementById("clearCart");

// === FUNÇÕES ===
function formatMoney(v){ return `R$ ${v.toFixed(2)}`; }

function renderProducts(){
  productGrid.innerHTML = "";
  products.forEach(p => {
    const card = document.createElement("article");
    card.className = "card";
    card.setAttribute("data-aos","fade-up");
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <div class="price">${formatMoney(p.price)}</div>
      <div class="actions">
        <button class="btn outline" data-id="${p.id}"><i class="fa fa-eye"></i> Ver</button>
        <button class="btn primary" data-id="${p.id}"><i class="fa fa-cart-plus"></i> Adicionar</button>
      </div>
    `;
    productGrid.appendChild(card);
  });

  // ligar botões
  productGrid.querySelectorAll(".actions .btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = Number(e.currentTarget.dataset.id);
      if(e.currentTarget.classList.contains("primary")){
        addToCart(id);
      } else {
        // ver detalhes (pode expandir depois)
        const prod = products.find(x=>x.id===id);
        swal(prod.name, `${prod.name}\n\nPreço: ${formatMoney(prod.price)}`, "info");
      }
    });
  });
}

function updateCartBadge(){
  const totalQty = cart.reduce((s,it)=> s + it.qty, 0);
  cartCount.textContent = totalQty;
}

function addToCart(productId){
  const item = cart.find(i => i.productId === productId);
  if(item) item.qty++;
  else cart.push({ productId, qty: 1 });

  renderCart();
  // anima feedback
  swal("Adicionado!", "Produto adicionado ao carrinho.", "success");
}

function removeFromCart(productId){
  const idx = cart.findIndex(i => i.productId===productId);
  if(idx > -1) cart.splice(idx,1);
  renderCart();
}

function changeQty(productId, delta){
  const item = cart.find(i => i.productId===productId);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0) removeFromCart(productId);
  renderCart();
}

function renderCart(){
  cartItemsTbody.innerHTML = "";
  cart.forEach(item => {
    const p = products.find(x => x.id === item.productId);
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.name}</td>
      <td>
        <button class="btn outline small" data-action="dec" data-id="${p.id}">-</button>
        <span style="margin:0 8px">${item.qty}</span>
        <button class="btn outline small" data-action="inc" data-id="${p.id}">+</button>
      </td>
      <td>${formatMoney(p.price)}</td>
      <td>${formatMoney(p.price * item.qty)}</td>
      <td><button class="btn outline small remove" data-id="${p.id}"><i class="fa fa-trash"></i></button></td>
    `;
    cartItemsTbody.appendChild(tr);
  });

  // ligar ações (inc/dec/remove)
  cartItemsTbody.querySelectorAll("button").forEach(b => {
    const id = Number(b.dataset.id);
    if(b.dataset.action === "inc") b.addEventListener("click", ()=> changeQty(id, +1));
    else if(b.dataset.action === "dec") b.addEventListener("click", ()=> changeQty(id, -1));
    else if(b.classList.contains("remove")) b.addEventListener("click", ()=> removeFromCart(id));
  });

  updateTotal();
  updateCartBadge();
  saveCart();
}

function updateTotal(){
  const total = cart.reduce((s,it) => {
    const p = products.find(x => x.id===it.productId);
    return s + p.price * it.qty;
  }, 0);
  totalEl.textContent = formatMoney(total);
}

// persistir no localStorage
function saveCart(){ localStorage.setItem("jl_cart", JSON.stringify(cart)); }
function loadCart(){
  const data = localStorage.getItem("jl_cart");
  if(data) cart = JSON.parse(data);
}

// UI: abrir/fechar cart & menu
btnCart.addEventListener("click", ()=> cartDrawer.classList.add("open"));
closeCart.addEventListener("click", ()=> cartDrawer.classList.remove("open"));
openMenu.addEventListener("click", ()=> sideMenu.classList.add("open"));
closeMenu.addEventListener("click", ()=> sideMenu.classList.remove("open"));
clearCartBtn.addEventListener("click", ()=> {
  cart = []; renderCart();
});
checkoutBtn.addEventListener("click", ()=> {
  if(cart.length===0){
    swal("Carrinho vazio", "Adicione produtos antes de finalizar.", "warning");
    return;
  }
  swal({
    title: "Finalizar compra?",
    text: "Deseja confirmar o pagamento e finalizar o pedido?",
    icon: "info",
    buttons: ["Cancelar","Confirmar"]
  }).then(confirmed => {
    if(confirmed){
      swal("Pedido realizado!", "Obrigado pela compra.", "success");
      cart = []; renderCart();
      cartDrawer.classList.remove("open");
    }
  });
});

// inicialização
loadCart();
renderProducts();
renderCart();

