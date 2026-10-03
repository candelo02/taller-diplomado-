document.addEventListener('DOMContentLoaded', () => {
  // Estado local de la aplicación
  let fullMenu = [];
  let cartItems = []; // [{ id, name, price, quantity }]
  let activeCategory = 'Todos';

  // Elementos DOM principales
  const promoBanner = document.getElementById('promo-banner');
  const productsGrid = document.getElementById('products-grid');
  const categoriesBar = document.getElementById('categories-bar');
  const searchInput = document.getElementById('search-input');

  // Nav & Cart Elements
  const cartCount = document.getElementById('cart-count');
  const btnOpenCartNav = document.getElementById('btn-open-cart-nav');
  const btnOpenReservationNav = document.getElementById('btn-open-reservation-nav');
  const heroBtnReserve = document.getElementById('hero-btn-reserve');

  // Feature Flag Controls
  const flagOnlineOrdering = document.getElementById('flag-online-ordering');
  const flagTableReservation = document.getElementById('flag-table-reservation');
  const flagPromotionsBanner = document.getElementById('flag-promotions-banner');

  // Modals & Backdrops
  const detailModal = document.getElementById('detail-modal');
  const cartModal = document.getElementById('cart-modal');
  const reservationModal = document.getElementById('reservation-modal');
  const confirmationModal = document.getElementById('confirmation-modal');

  // Detail Modal Elements
  const detailImg = document.getElementById('detail-img');
  const detailTitle = document.getElementById('detail-title');
  const detailPrice = document.getElementById('detail-price');
  const detailDescription = document.getElementById('detail-description');
  const detailIngredients = document.getElementById('detail-ingredients');
  const detailAddBtn = document.getElementById('detail-add-btn');
  let selectedDetailId = null;

  // Cart Modal Elements
  const cartDisabledBanner = document.getElementById('cart-disabled-banner');
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartSubtotal = document.getElementById('cart-subtotal');
  const cartService = document.getElementById('cart-service');
  const cartTotal = document.getElementById('cart-total');
  const orderForm = document.getElementById('order-form');

  // Reservation Modal Elements
  const reservationDisabledBanner = document.getElementById('reservation-disabled-banner');
  const reservationForm = document.getElementById('reservation-form');

  // Confirmation Elements
  const confTitle = document.getElementById('conf-title');
  const confMessage = document.getElementById('conf-message');
  const confDetails = document.getElementById('conf-details');

  // Cargar Datos Iniciales
  loadFeatureFlags();
  fetchMenu();

  // --- EVENT LISTENERS FLAGS ---
  flagOnlineOrdering.addEventListener('change', async () => {
    await updateFlagOnServer('online_ordering_enabled', flagOnlineOrdering.checked);
    loadFeatureFlags();
  });

  flagTableReservation.addEventListener('change', async () => {
    await updateFlagOnServer('table_reservation_enabled', flagTableReservation.checked);
    loadFeatureFlags();
  });

  flagPromotionsBanner.addEventListener('change', async () => {
    await updateFlagOnServer('promotions_banner_enabled', flagPromotionsBanner.checked);
    loadFeatureFlags();
  });

  // --- EVENT LISTENERS NAVEGACIÓN Y BÚSQUEDA ---
  categoriesBar.addEventListener('click', (e) => {
    if (e.target.classList.contains('cat-btn')) {
      document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
      e.target.classList.add('active');
      activeCategory = e.target.getAttribute('data-cat');
      filterAndRenderMenu();
    }
  });

  searchInput.addEventListener('input', () => {
    filterAndRenderMenu();
  });

  // --- MODALS OPEN/CLOSE ---
  btnOpenCartNav.addEventListener('click', () => openModal(cartModal));
  btnOpenReservationNav.addEventListener('click', () => openModal(reservationModal));
  heroBtnReserve.addEventListener('click', () => openModal(reservationModal));

  document.getElementById('btn-close-detail').addEventListener('click', () => closeModal(detailModal));
  document.getElementById('btn-close-cart').addEventListener('click', () => closeModal(cartModal));
  document.getElementById('btn-close-reservation').addEventListener('click', () => closeModal(reservationModal));
  document.getElementById('btn-close-conf').addEventListener('click', () => closeModal(confirmationModal));

  // --- ACCIONES DE COMPRA Y RESERVA ---
  detailAddBtn.addEventListener('click', () => {
    if (selectedDetailId) {
      addToCart(selectedDetailId);
      closeModal(detailModal);
    }
  });

  orderForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert('Tu carrito está vacío.');
      return;
    }

    const name = document.getElementById('order-name').value.trim();
    const phone = document.getElementById('order-phone').value.trim();
    const address = document.getElementById('order-address').value.trim();
    const notes = document.getElementById('order-notes').value.trim();

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name,
          phone,
          address,
          notes,
          items: cartItems.map(item => ({ id: item.id, quantity: item.quantity }))
        })
      });

      const data = await res.json();
      if (!res.ok) {
        alert(`Error: ${data.error}`);
        return;
      }

      // Vaciar carrito
      cartItems = [];
      updateCartBadge();
      closeModal(cartModal);

      // Mostrar confirmación
      showConfirmation(
        '¡Pedido Confirmado!',
        `Gracias ${data.order.customerName}. Tu pedido ha sido registrado con éxito.`,
        `<p><strong>Código de Pedido:</strong> ${data.order.orderId}</p>
         <p><strong>Total a pagar:</strong> $${data.order.total.toFixed(2)}</p>
         <p><small>Te notificaremos el estado de preparación.</small></p>`
      );
    } catch (err) {
      alert('Error procesando pedido.');
    }
  });

  reservationForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('res-name').value.trim();
    const email = document.getElementById('res-email').value.trim();
    const phone = document.getElementById('res-phone').value.trim();
    const date = document.getElementById('res-date').value;
    const time = document.getElementById('res-time').value;
    const guests = document.getElementById('res-guests').value;
    const specialRequests = document.getElementById('res-requests').value.trim();

    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, date, time, guests, specialRequests })
      });

      const data = await res.json();
      if (!res.ok) {
        alert(`Error: ${data.error}`);
        return;
      }

      reservationForm.reset();
      closeModal(reservationModal);

      showConfirmation(
        '¡Reserva Confirmada!',
        `Estimado/a ${data.reservation.name}, tu mesa ha sido reservada con éxito.`,
        `<p><strong>Código de Reserva:</strong> ${data.reservation.reservationId}</p>
         <p><strong>Fecha y Hora:</strong> ${data.reservation.date} a las ${data.reservation.time}</p>
         <p><strong>Comensales:</strong> ${data.reservation.guests} personas</p>`
      );
    } catch (err) {
      alert('Error al realizar reserva.');
    }
  });

  // --- FUNCIONES LÓGICAS ---
  async function fetchMenu() {
    try {
      const res = await fetch('/api/menu');
      fullMenu = await res.json();
      filterAndRenderMenu();
    } catch (err) {
      productsGrid.innerHTML = '<p class="description">Error cargando menú gourmet.</p>';
    }
  }

  function filterAndRenderMenu() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    let filtered = fullMenu;

    if (activeCategory !== 'Todos') {
      filtered = filtered.filter(item => item.category === activeCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.ingredients.some(ing => ing.toLowerCase().includes(searchTerm))
      );
    }

    renderProductsGrid(filtered);
  }

  function renderProductsGrid(items) {
    productsGrid.innerHTML = '';
    if (items.length === 0) {
      productsGrid.innerHTML = '<div class="panel text-center full-width"><p>No se encontraron platos que coincidan con la búsqueda.</p></div>';
      return;
    }

    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <div class="product-img-wrapper">
          <img src="${item.image}" alt="${item.name}" class="product-img">
          <span class="product-badge">${item.badge}</span>
        </div>
        <div class="product-info">
          <div class="product-title-row">
            <h3 class="product-title">${escapeHtml(item.name)}</h3>
            <span class="product-rating">★ ${item.rating}</span>
          </div>
          <p class="product-desc">${escapeHtml(item.description)}</p>
          <div class="product-bottom-row">
            <span class="product-price">$${item.price.toFixed(2)}</span>
            <div class="product-actions">
              <button class="btn-icon btn-detail-action" data-id="${item.id}">👁 Detalle</button>
              <button class="btn-icon btn-add-action" data-id="${item.id}">+ Pedir</button>
            </div>
          </div>
        </div>
      `;

      card.querySelector('.btn-detail-action').addEventListener('click', () => openDetailModal(item));
      card.querySelector('.btn-add-action').addEventListener('click', () => addToCart(item.id));

      productsGrid.appendChild(card);
    });
  }

  function openDetailModal(item) {
    selectedDetailId = item.id;
    detailImg.src = item.image;
    detailTitle.textContent = item.name;
    detailPrice.textContent = `$${item.price.toFixed(2)}`;
    detailDescription.textContent = item.description;

    detailIngredients.innerHTML = '';
    item.ingredients.forEach(ing => {
      const li = document.createElement('li');
      li.textContent = ing;
      detailIngredients.appendChild(li);
    });

    openModal(detailModal);
  }

  function addToCart(productId) {
    if (!flagOnlineOrdering.checked) {
      alert('El servicio de pedidos en línea no está habilitado actualmente.');
      return;
    }

    const menuItem = fullMenu.find(m => m.id === productId);
    if (!menuItem) return;

    const existing = cartItems.find(c => c.id === productId);
    if (existing) {
      existing.quantity++;
    } else {
      cartItems.push({
        id: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: 1
      });
    }

    updateCartBadge();
    renderCart();
  }

  function updateCartBadge() {
    const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    cartCount.textContent = totalCount;
  }

  function renderCart() {
    cartItemsContainer.innerHTML = '';

    if (cartItems.length === 0) {
      cartItemsContainer.innerHTML = '<p class="text-center text-muted">Tu carrito está vacío.</p>';
      cartSubtotal.textContent = '$0.00';
      cartService.textContent = '$0.00';
      cartTotal.textContent = '$0.00';
      return;
    }

    let subtotal = 0;
    cartItems.forEach(item => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      const row = document.createElement('div');
      row.className = 'cart-item-row';
      row.innerHTML = `
        <div>
          <strong>${escapeHtml(item.name)}</strong>
          <div class="text-muted"><small>$${item.price.toFixed(2)} c/u</small></div>
        </div>
        <div class="cart-qty-ctrl">
          <button class="btn-qty btn-minus" data-id="${item.id}">-</button>
          <span>${item.quantity}</span>
          <button class="btn-qty btn-plus" data-id="${item.id}">+</button>
          <strong style="margin-left: 0.5rem;">$${itemTotal.toFixed(2)}</strong>
        </div>
      `;

      row.querySelector('.btn-minus').addEventListener('click', () => changeCartQty(item.id, -1));
      row.querySelector('.btn-plus').addEventListener('click', () => changeCartQty(item.id, 1));

      cartItemsContainer.appendChild(row);
    });

    const service = subtotal * 0.10;
    const total = subtotal + service;

    cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    cartService.textContent = `$${service.toFixed(2)}`;
    cartTotal.textContent = `$${total.toFixed(2)}`;
  }

  function changeCartQty(productId, delta) {
    const item = cartItems.find(c => c.id === productId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      cartItems = cartItems.filter(c => c.id !== productId);
    }

    updateCartBadge();
    renderCart();
  }

  async function loadFeatureFlags() {
    try {
      const res = await fetch('/api/feature-flags');
      const data = await res.json();
      const raw = data.raw_flags;

      flagOnlineOrdering.checked = raw.online_ordering_enabled;
      flagTableReservation.checked = raw.table_reservation_enabled;
      flagPromotionsBanner.checked = raw.promotions_banner_enabled;

      // Banner Promociones
      if (raw.promotions_banner_enabled) {
        promoBanner.classList.remove('hidden');
      } else {
        promoBanner.classList.add('hidden');
      }

      // Pedidos en línea UI
      if (raw.online_ordering_enabled) {
        cartDisabledBanner.classList.add('hidden');
        document.getElementById('btn-confirm-order').removeAttribute('disabled');
      } else {
        cartDisabledBanner.classList.remove('hidden');
        document.getElementById('btn-confirm-order').setAttribute('disabled', 'true');
      }

      // Reserva de Mesas UI
      if (raw.table_reservation_enabled) {
        reservationDisabledBanner.classList.add('hidden');
        document.getElementById('btn-submit-reservation').removeAttribute('disabled');
      } else {
        reservationDisabledBanner.classList.remove('hidden');
        document.getElementById('btn-submit-reservation').setAttribute('disabled', 'true');
      }
    } catch (err) {
      console.error('Error cargando flags:', err);
    }
  }

  async function updateFlagOnServer(flag, value) {
    try {
      await fetch('/api/feature-flags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flag, value })
      });
    } catch (err) {
      console.error('Error actualizando flag en servidor:', err);
    }
  }

  function openModal(modal) {
    if (modal === cartModal) renderCart();
    modal.classList.remove('hidden');
  }

  function closeModal(modal) {
    modal.classList.add('hidden');
  }

  function showConfirmation(title, message, detailsHtml) {
    confTitle.textContent = title;
    confMessage.textContent = message;
    confDetails.innerHTML = detailsHtml;
    openModal(confirmationModal);
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
});
