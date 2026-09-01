// ==========================================
// DULCE NONOGASTA - JS
// Carrito + filtros + checkout simulado
// Sin base de datos
// ==========================================

const products = [
  {
    id: 1,
    name: "Gelatina de yogur & frutilla",
    price: 1000,
    category: "leche",
    badge: "Más pedida",
    description: "Gelatina de frutilla con base cremosa de yogur. Fresca y suave.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMWIlBTMVlL2c3RlrRqKCYHB1oGi3Il7CGGPdImE-lMw&s=10"
  },
  {
    id: 2,
    name: "Gelatina de leche con frutilla",
    price: 1000,
    category: "leche",
    badge: "Especial",
    description: "Capas de gelatina de frutilla y una cremosa capa de leche.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_4rsyn13dQMA0ySAYg4Dlq-dPxumYy7GQ5GYFtw0V_g&s=10"
  },
  {
    id: 3,
    name: "Gelatina de leche con durazno",
    price: 1000,
    category: "leche",
    badge: "Cremosa",
    description: "Gelatina de durazno combinada con una base blanca y cremosa.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSifdJLC_kfGwRZOgNBkt64fBNUDQ1Kat5e7Kavbe4e-g&s=10"
  },
  {
    id: 4,
    name: "Gelatina de durazno",
    price: 500,
    category: "frutal",
    badge: "Frutal",
    description: "Sabor durazno, textura firme y bien fresca para disfrutar fría.",
    image: "https://gotvach.bg/files/1200x800/jelly-peaches.webp"
  },
  {
    id: 5,
    name: "Gelatina de frutilla",
    price: 500,
    category: "frutal",
    badge: "Clásica",
    description: "La clásica gelatina de frutilla: dulce, fresca y refrescante.",
    image: "https://cdn0.tudoreceitas.com/pt/posts/2/9/8/sobremesa_de_gelatina_de_morango_6892_orig.jpg"
  },
  {
    id: 6,
    name: "Gelatina de dulce de leche",
    price: 500,
    category: "especial",
    badge: "Especial",
    description: "Gelatina cremosa de dulce de leche, para los que quieren algo distinto.",
    image: "https://pasteleriasmarisa.com.mx/cdn/shop/products/GelatinaCajeta.png?v=1738992454&width=1080"
  }
];

let cart = JSON.parse(localStorage.getItem("dulceNonogastaCart")) || [];

const productsGrid = document.getElementById("productsGrid");
const cartModal = document.getElementById("cartModal");
const checkoutModal = document.getElementById("checkoutModal");
const cartItems = document.getElementById("cartItems");
const emptyCart = document.getElementById("emptyCart");
const cartCount = document.getElementById("cartCount");
const cartSubtotal = document.getElementById("cartSubtotal");
const cartTotal = document.getElementById("cartTotal");
const demoOrder = document.getElementById("demoOrder");
const toast = document.getElementById("toast");

function money(value) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  }).format(value);
}

function renderProducts(filter = "todos") {
  const visibleProducts = filter === "todos"
    ? products
    : products.filter(product => product.category === filter);

  productsGrid.innerHTML = visibleProducts.map(product => `
    <article class="product-card">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy"
             onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80';">
        <span class="badge">${product.badge}</span>
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-bottom">
          <span class="price">${money(product.price)}</span>
          <button class="add-btn" data-add="${product.id}">+ Agregar</button>
        </div>
      </div>
    </article>
  `).join("");
}

function saveCart() {
  localStorage.setItem("dulceNonogastaCart", JSON.stringify(cart));
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty: 1
    });
  }

  saveCart();
  renderCart();
  showToast(`${product.name} agregado al carrito 🛒`);
}

function changeQuantity(id, amount) {
  const item = cart.find(product => product.id === id);
  if (!item) return;

  item.qty += amount;

  if (item.qty <= 0) {
    cart = cart.filter(product => product.id !== id);
  }

  saveCart();
  renderCart();
}

function removeItem(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  renderCart();
  showToast("Producto eliminado del carrito");
}

function getCartTotal() {
  return cart.reduce((total, item) => total + item.price * item.qty, 0);
}

function getCartCount() {
  return cart.reduce((total, item) => total + item.qty, 0);
}

function renderCart() {
  const count = getCartCount();
  const total = getCartTotal();

  cartCount.textContent = count;
  cartSubtotal.textContent = money(total);
  cartTotal.textContent = money(total);

  if (cart.length === 0) {
    cartItems.innerHTML = "";
    emptyCart.style.display = "block";
    return;
  }

  emptyCart.style.display = "none";

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img class="cart-thumb" src="${item.image}" alt="${item.name}">
      <div>
        <h4>${item.name}</h4>
        <p>${money(item.price)} c/u</p>
        <div class="qty">
          <button data-minus="${item.id}" aria-label="Restar">−</button>
          <strong>${item.qty}</strong>
          <button data-plus="${item.id}" aria-label="Sumar">+</button>
          <button class="remove-item" data-remove="${item.id}">Eliminar</button>
        </div>
      </div>
      <strong>${money(item.price * item.qty)}</strong>
    </div>
  `).join("");
}

function openModal(modal) {
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal(modal) {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");

  if (!cartModal.classList.contains("open") && !checkoutModal.classList.contains("open")) {
    document.body.style.overflow = "";
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function renderDemoOrder() {
  if (cart.length === 0) {
    demoOrder.innerHTML = "<p>No hay productos en el pedido.</p>";
    return;
  }

  demoOrder.innerHTML = `
    ${cart.map(item => `
      <div class="demo-order-row">
        <span>${item.name} × ${item.qty}</span>
        <strong>${money(item.price * item.qty)}</strong>
      </div>
    `).join("")}
    <div class="demo-order-row demo-order-total">
      <span>Total</span>
      <strong>${money(getCartTotal())}</strong>
    </div>
  `;
}

// Eventos del catálogo
productsGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (!button) return;

  addToCart(Number(button.dataset.add));
});

// Eventos del carrito
cartItems.addEventListener("click", event => {
  const plus = event.target.closest("[data-plus]");
  const minus = event.target.closest("[data-minus]");
  const remove = event.target.closest("[data-remove]");

  if (plus) changeQuantity(Number(plus.dataset.plus), 1);
  if (minus) changeQuantity(Number(minus.dataset.minus), -1);
  if (remove) removeItem(Number(remove.dataset.remove));
});

// Filtros
document.getElementById("filters").addEventListener("click", event => {
  const filter = event.target.closest(".filter");
  if (!filter) return;

  document.querySelectorAll(".filter").forEach(btn => btn.classList.remove("active"));
  filter.classList.add("active");
  renderProducts(filter.dataset.filter);
});

// Abrir/cerrar carrito
document.getElementById("openCart").addEventListener("click", () => openModal(cartModal));
document.getElementById("heroCart").addEventListener("click", () => openModal(cartModal));
document.getElementById("contactCart").addEventListener("click", () => openModal(cartModal));
document.getElementById("closeCart").addEventListener("click", () => closeModal(cartModal));
document.getElementById("closeCartBackdrop").addEventListener("click", () => closeModal(cartModal));
document.getElementById("continueBtn").addEventListener("click", () => closeModal(cartModal));

// Checkout
document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (cart.length === 0) {
    showToast("Primero agregá algún producto al carrito 🙂");
    return;
  }

  renderDemoOrder();
  closeModal(cartModal);
  openModal(checkoutModal);
});

document.getElementById("closeCheckout").addEventListener("click", () => closeModal(checkoutModal));

document.getElementById("checkoutModal").querySelector(".modal-backdrop")
  .addEventListener("click", () => closeModal(checkoutModal));

document.getElementById("checkoutForm").addEventListener("submit", event => {
  event.preventDefault();

  const name = document.getElementById("customerName").value.trim();
  const delivery = document.getElementById("delivery").value;
  const note = document.getElementById("orderNote").value.trim();

  if (!name || !delivery) return;

  const orderNumber = Math.floor(1000 + Math.random() * 9000);

  alert(
    `¡Pedido simulado confirmado!\\n\\n` +
    `Cliente: ${name}\\n` +
    `Modalidad: ${delivery}\\n` +
    `Total: ${money(getCartTotal())}\\n` +
    `Pedido N.º: #${orderNumber}` +
    (note ? `\\nNota: ${note}` : "") +
    `\\n\\nEn una versión real, este pedido podría enviarse al vendedor.`
  );

  cart = [];
  saveCart();
  renderCart();
  event.target.reset();
  closeModal(checkoutModal);
  showToast("Pedido simulado realizado con éxito ✨");
});

// Menú móvil
document.getElementById("menuBtn").addEventListener("click", () => {
  document.getElementById("navLinks").classList.toggle("open");
});

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    document.getElementById("navLinks").classList.remove("open");
  });
});

// ESC para cerrar modales
document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeModal(cartModal);
    closeModal(checkoutModal);
  }
});

// Inicialización
renderProducts();
renderCart();
