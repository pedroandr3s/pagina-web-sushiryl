// Obtener el contador del carrito
const cartCount = document.getElementById('cart-count');

// Función para actualizar el contador en el menú
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Manejar el evento de agregar al carrito
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        const name = button.dataset.name; // Nombre del producto
        const price = parseInt(button.dataset.price, 10); // Precio del producto

        // Verifica si 'name' y 'price' tienen valores válidos
        if (!name || isNaN(price)) {
            console.error('Error: el producto no tiene nombre o precio válido.');
            return; // Si falta el nombre o el precio, no hace nada
        }

        // Obtener el carrito actual del localStorage
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Buscar si el producto ya existe en el carrito
        const existingItem = cart.find(item => item.name === name);

        // Si el producto existe, aumenta la cantidad
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            // Si el producto no existe, lo agrega al carrito
            cart.push({ name, price, quantity: 1 });
        }

        // Guardar el carrito actualizado en localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Actualizar el contador del carrito
        updateCartCount();
    });
});

// Inicializar el contador al cargar la página
updateCartCount();
