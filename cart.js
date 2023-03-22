
const cartJson = window.sessionStorage.getItem("cart");
let cart = [];
let lastCart;

if (cartJson) {
    cart = JSON.parse(cartJson);
}

function updateCart() {
    window.sessionStorage.setItem("cart", JSON.stringify(cart));
    if (cart.length > 0) {
	const total = cart.reduce((sum, item) => sum + item.quantity, 0);
	document.getElementById("cart").text = `Cart (${total})`;
    } else {
	document.getElementById("cart").text = "Cart";
    }
}

function addToCart(item) {
    const existingItem = cart.find(({ id }) => item.id === id);
    if (existingItem) {
	existingItem.quantity += item.quantity;
	existingItem.total += item.total;
    } else {
	cart.push(item);
    }
    updateCart();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
    renderCartTable();
}

function clearCart() {
    lastCart = cart;
    cart = [];
    updateCart();
}

function renderCartTable() {
    const html = cart.map(item =>
	`<tr><td>${item.name}</td><td>${item.quantity}</td><td>$${item.total}</td><td><button onclick="removeFromCart('${item.id}')">Delete</button></td><tr>`
    ).join("");
    document.getElementById("cartBody").innerHTML = html;
}

function renderCheckoutTotal() {
    const total = cart.reduce((sum, item) => {
	return sum + item.total;
    }, 0);
    document.getElementById("total").innerHTML = `$${total}`;
}

function generateProductString() {
    return lastCart.map(item => {
	return [
	    item.id,
	    item.name,
	    item.quantity,
	    item.total,
	    Object.keys(item.events || {}).map(eventKey => {
		return `${eventKey}=${item.events[eventKey]}`;
	    }).join("|"),
	    Object.keys(item.evars || {}).map(evarKey => {
		return `${evarKey}=${item.evars[evarKey]}`;
	    }).join("|")
	].join(";");
    }).join(",");
}

updateCart();
