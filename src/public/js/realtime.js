const socket = io();

const productForm = document.getElementById('product-form');
const productList = document.getElementById('product-list');
const categoryFilter = document.getElementById('category-filter');
const priceSort = document.getElementById('price-sort');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const currentPageSpan = document.getElementById('current-page');

let currentPage = 1;
let currentCategory = '';
let currentSort = '';

productForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(productForm);
  const product = {
    title: formData.get('title'),
    price: formData.get('price'),
    category: formData.get('category'),
    description: formData.get('description')
  };
  socket.emit('new-product', product);
  productForm.reset();
});

categoryFilter.addEventListener('change', (e) => {
  currentCategory = e.target.value;
  currentPage = 1;
  updateProducts();
});

priceSort.addEventListener('change', (e) => {
  currentSort = e.target.value;
  currentPage = 1;
  updateProducts();
});

prevPageBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    updateProducts();
  }
});

nextPageBtn.addEventListener('click', () => {
  currentPage++;
  updateProducts();
});

function updateProducts() {
  socket.emit('request-products', {
    page: currentPage,
    category: currentCategory,
    sort: currentSort
  });
}

function addToCart(productId) {
  fetch(`/api/carts/{{cartId}}/product/${productId}`, {
    method: 'POST',
  })
  .then(response => response.json())
  .then(data => {
    alert('Producto agregado al carrito');
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Error al agregar el producto');
  });
}

socket.on('product-list', ({payload, totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, prevLink, nextLink}) => {
  productList.innerHTML = '';
  
  payload.forEach((p) => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    
    productCard.innerHTML = `
      <h3>${p.title}</h3>
      <p class="price">$${p.price}</p>
      <p>${p.description || ''}</p>
      <div class="actions">
        <a href="/products/${p._id}" class="view-details">Ver detalles</a>
        <button onclick="addToCart('${p._id}')" class="add-to-cart">Agregar al carrito</button>
        <button onclick="socket.emit('delete-product', '${p._id}')" class="delete-product">Eliminar</button>
      </div>
    `;
    
    productList.appendChild(productCard);
  });

  currentPageSpan.textContent = currentPage;
  prevPageBtn.disabled = !hasPrevPage;
  nextPageBtn.disabled = !hasNextPage;
});

updateProducts();
