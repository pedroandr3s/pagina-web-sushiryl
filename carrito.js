// Elementos DOM
const cartItemsDiv = document.getElementById('cart-items');
const cartTotalP = document.getElementById('cart-total');
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Obtener las opciones de entrega
const pickupRadio = document.getElementById('pickup');
const deliveryRadio = document.getElementById('delivery');
const addressContainer = document.getElementById('address-container');

// Función para mostrar/ocultar el campo de dirección
function toggleAddressField() {
    if (deliveryRadio.checked) {
        addressContainer.style.display = 'block'; // Muestra el campo de dirección
    } else {
        addressContainer.style.display = 'none'; // Oculta el campo de dirección
    }
}

// Inicializar el estado del campo de dirección al cargar la página
toggleAddressField();

// Agregar event listeners para mostrar/ocultar la dirección cuando se cambia la opción de entrega
pickupRadio.addEventListener('change', toggleAddressField);
deliveryRadio.addEventListener('change', toggleAddressField);

// Función para actualizar la visualización del carrito
function updateCartDisplay() {
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p>Tu carrito está vacío.</p>';
    } else {
        cartItemsDiv.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <p>${item.name} x${item.quantity} - $${(item.price * item.quantity).toLocaleString()}</p>
                <button class="quantity-btn decrease" data-index="${index}">-</button>
                <button class="quantity-btn increase" data-index="${index}">+</button>
                <button class="delete-btn remove" data-index="${index}">Eliminar</button>
            </div>
        `).join('');
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotalP.textContent = `Total: $${total.toLocaleString()}`;
}

// Renderizar los productos al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    updateCartDisplay();
});

// Manejo de eventos en el carrito
cartItemsDiv.addEventListener('click', (event) => {
    const index = event.target.dataset.index;

    if (event.target.classList.contains('increase')) {
        cart[index].quantity += 1;
    } else if (event.target.classList.contains('decrease')) {
        if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
        } else {
            const removeProduct = confirm('¿Estás seguro de que quieres eliminar este producto?');
            if (removeProduct) {
                cart.splice(index, 1);
            }
        }
    } else if (event.target.classList.contains('remove')) {
        const removeProduct = confirm('¿Estás seguro de que quieres eliminar este producto?');
        if (removeProduct) {
            cart.splice(index, 1);
        }
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
});

// Función para procesar el pedido
document.getElementById('checkout').addEventListener('click', () => {
    const name = document.getElementById('name').value;
    const deliveryOption = document.querySelector('input[name="delivery"]:checked'); // Opción de entrega
    const address = document.getElementById('address').value; // Dirección si aplica
    const sauceOption = document.querySelector('input[name="sauce"]:checked'); // Opción de salsa
    const paymentOption = document.querySelector('input[name="payment"]:checked'); // Método de pago

    // Validar campos obligatorios
    if (name === "" || !deliveryOption || !sauceOption || !paymentOption) {
        alert("Por favor, completa todos los campos obligatorios.");
        return;
    }

    const deliveryMethod = deliveryOption.value; // "Retira en local" o "Pedido a repartir"
    const sauce = sauceOption.value; // "Soya" o "Agridulce"
    const paymentMethod = paymentOption.value; // "Efectivo" o "Transferencia"

    if (cart.length === 0) {
        alert('El carrito está vacío.');
    } else {
        let orderDetails = `*Pedido de ${name}*\n`;
        orderDetails += `Método de entrega: ${deliveryMethod}\n`;

        if (deliveryMethod === "Pedido a repartir") {
            if (address === "") {
                alert("Por favor, ingresa una dirección para el reparto.");
                return;
            }
            orderDetails += `Dirección de entrega: ${address}\n`;
            orderDetails += `Reparto - $1500\n`;
        }

        orderDetails += `\nSalsa seleccionada: ${sauce}\n`;
        orderDetails += `Método de pago: ${paymentMethod}\n\n`;
        orderDetails += `Productos:\n`;

        cart.forEach(item => {
            orderDetails += `${item.name} x${item.quantity} - $${(item.price * item.quantity).toLocaleString()}\n`;
        });

        let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        if (deliveryMethod === "Pedido a repartir") {
            total += 1500;
        }

        orderDetails += `\nTotal: $${total.toLocaleString()}`;
        
        const encodedMessage = encodeURIComponent(orderDetails);
        const phoneNumber = '56944614118'; // Cambiar por el número de WhatsApp
        const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        // Abrir WhatsApp en una nueva ventana
        window.open(whatsappLink, '_blank');
        
        // Limpiar carrito tras el pedido
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
    }
});
