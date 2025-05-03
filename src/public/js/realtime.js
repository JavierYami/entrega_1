const socket = io();

const productForm = document.getElementById('product-form');
const productList = document.getElementById('product-list');

productForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(productForm);
  const product = {
    title: formData.get('title'),
    price: formData.get('price')
  };
  socket.emit('new-product', product);
  productForm.reset();
});

socket.on('product-list', (products) => {
  productList.innerHTML = '';
  products.forEach((p) => {
    const li = document.createElement('li');
    li.textContent = `${p.title} - ${p.price}`;
    productList.appendChild(li);
    const btn = document.createElement('button');
    btn.textContent = 'Eliminar';
    btn.onclick = () => socket.emit('delete-product', p.id);
    li.appendChild(btn);
  });
});
