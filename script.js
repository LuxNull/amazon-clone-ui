const cart = new Map();
const cartItems = document.querySelector("#cart-items");
const cartCount = document.querySelector("#cart-count");
const cartEmpty = document.querySelector("#cart-empty");
const cartTotal = document.querySelector("#cart-total");
const cartToggle = document.querySelector(".cart-toggle");
const cartPanel = document.querySelector("#cart-panel");
const cartWrapper = document.querySelector(".cart-wrapper");
const currencyFormatter = new Intl.NumberFormat("uk-UA", {
    style: "currency",
    currency: "UAH",
    maximumFractionDigits: 0
});
const itemPluralRules = new Intl.PluralRules("uk");
const itemLabels = {
    one: "товар",
    few: "товари",
    many: "товарів",
    other: "товарів"
};
 
function renderCart() {
    cartItems.replaceChildren();
    let quantity = 0;
    let total = 0;
 
    for (const [id, item] of cart) {
        quantity += item.quantity;
        total += item.price * item.quantity;
 
        const row = document.createElement("li");
        row.className = "cart-item";
 
        const name = document.createElement("span");
        name.className = "cart-item-name";
        name.textContent = item.name;
 
        const price = document.createElement("span");
        price.textContent = currencyFormatter.format(item.price * item.quantity);
 
        const quantityControls = document.createElement("div");
        quantityControls.className = "quantity-controls";
 
        const decreaseButton = document.createElement("button");
        decreaseButton.type = "button";
        decreaseButton.dataset.action = "decrease";
        decreaseButton.dataset.id = id;
        decreaseButton.setAttribute("aria-label", `Зменшити кількість: ${item.name}`);
        decreaseButton.textContent = "−";
 
        const quantityLabel = document.createElement("span");
        quantityLabel.textContent = String(item.quantity);
        quantityLabel.setAttribute("aria-label", "Кількість");
 
        const increaseButton = document.createElement("button");
        increaseButton.type = "button";
        increaseButton.dataset.action = "increase";
        increaseButton.dataset.id = id;
        increaseButton.setAttribute("aria-label", `Збільшити кількість: ${item.name}`);
        increaseButton.textContent = "+";
 
        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "remove-button";
        removeButton.dataset.action = "remove";
        removeButton.dataset.id = id;
        removeButton.textContent = "Видалити";
 
        quantityControls.append(decreaseButton, quantityLabel, increaseButton);
        row.append(name, quantityControls, price, removeButton);
        cartItems.append(row);
    }
 
    cartCount.textContent = String(quantity);
    cartToggle.setAttribute(
        "aria-label",
        `Відкрити кошик, ${quantity} ${itemLabels[itemPluralRules.select(quantity)]}`
    );
    cartTotal.textContent = currencyFormatter.format(total);
    cartEmpty.hidden = cart.size > 0;
    cartItems.hidden = cart.size === 0;
}
 
function setCartOpen(isOpen) {
    cartPanel.hidden = !isOpen;
    cartToggle.setAttribute("aria-expanded", String(isOpen));
}
 
cartToggle.addEventListener("click", () => {
    setCartOpen(cartPanel.hidden);
});
 
document.querySelector(".cart-close").addEventListener("click", () => {
    setCartOpen(false);
    cartToggle.focus();
});
 
document.addEventListener("click", (event) => {
    if (!cartWrapper.contains(event.target)) {
        setCartOpen(false);
    }
});
 
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !cartPanel.hidden) {
        setCartOpen(false);
        cartToggle.focus();
    }
});
 
document.querySelector(".products").addEventListener("click", (event) => {
    const button = event.target.closest(".buy-button");
    if (!button) {
        return;
    }
 
    const { id, name, price } = button.dataset;
    const item = cart.get(id);
    if (item) {
        item.quantity += 1;
    } else {
        cart.set(id, { name, price: Number(price), quantity: 1 });
    }
 
    renderCart();
});
 
cartItems.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) {
        return;
    }
 
    const { id, action } = button.dataset;
    const item = cart.get(id);
    if (!item) {
        return;
    }
 
    if (action === "remove" || (action === "decrease" && item.quantity === 1)) {
        cart.delete(id);
    } else if (action === "decrease") {
        item.quantity -= 1;
    } else if (action === "increase") {
        item.quantity += 1;
    }
 
    renderCart();
});
 
renderCart();