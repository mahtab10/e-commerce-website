const manageSpinner = (status) => {
    const spinner = document.getElementById("spinner");
    const container = document.getElementById("card-container");
    if (status) {
        spinner.classList.remove("hidden");
        container.classList.add("hidden");
    } else {
        spinner.classList.add("hidden");
        container.classList.remove("hidden");
    }
};

const cartContainer = document.getElementById("cart-container");
let cartItems = [];

const addToCart = (product) => {
    cartItems.push(product);
    displayCart();
};

const removeFromCart = (id) => {
    cartItems = cartItems.filter(item => item.id !== id);
    displayCart();
};

const displayCart = () => {
    cartContainer.innerHTML = "";
    let total = 0;
    cartItems.forEach(item => {
        total += item.price;
        const div = document.createElement("div");
        div.className = "flex justify-between items-center p-2 mb-2 bg-gray-100 rounded";
        div.innerHTML = `
            <span>${item.title} - $${item.price}</span>
            <button class="remove-btn font-bold button-hover">X</button>
        `;
        div.querySelector(".remove-btn").addEventListener("click", () => removeFromCart(item.id));
        cartContainer.appendChild(div);
    });
    if (cartItems.length > 0) {
        const totalDiv = document.createElement("div");
        totalDiv.className = "mt-3 font-semibold";
        totalDiv.textContent = `Total: $${total.toFixed(2)}`;
        cartContainer.appendChild(totalDiv);
    }
};

const loadAllProducts = async () => {
    manageSpinner(true);
    const res = await fetch("https://fakestoreapi.com/products");
    const data = await res.json();
    displayProducts(data);
    manageSpinner(false);
};

const loadProductDetail = async (id) => {
    const res = await fetch(`https://fakestoreapi.com/products/${id}`);
    const product = await res.json();
    showProductModal(product);
};

const showProductModal = (product) => {
    const container = document.getElementById("details-container");
    container.innerHTML = `
        <div class="space-y-3">
            <img src="${product.image}" class="w-full h-48 object-contain">
            <h2 class="text-xl font-bold">${product.title}</h2>
            <p class="text-sm">${product.description}</p>
            <div class="flex justify-between items-center">
                <span class="bg-green-200 px-3 py-1 rounded">${product.category}</span>
                <span class="font-semibold">$${product.price}</span>
            </div>
            <button id="modalAddBtn" class="w-full py-2 rounded color-primary text-white button-hover">
                Add to Cart
            </button>
        </div>
    `;
    document.getElementById("modalAddBtn").addEventListener("click", () => addToCart(product));
    const modal = document.getElementById("plant_modal");
    if (!modal.open) modal.showModal();
};

const closeModal = () => {
    const modal = document.getElementById("plant_modal");
    if (modal.open) modal.close();
};

const displayProducts = (products) => {
    const container = document.getElementById("card-container");
    container.innerHTML = "";
    products.forEach(product => {
        const card = document.createElement("div");
        card.className = "p-4";
        card.innerHTML = `
            <div class="bg-white shadow rounded-xl p-4 flex flex-col h-full">
                <img src="${product.image}" class="w-full h-48 object-contain">
                <h3 class="product-title text-lg font-semibold mt-3 cursor-pointer color-font hover:button-hover">
                    ${product.title}
                </h3>
                <p class="text-sm my-2">${product.description.substring(0, 80)}...</p>
                <div class="flex justify-between items-center mt-auto mb-3">
                    <span class="bg-green-200 px-3 py-1 rounded text-sm">${product.category}</span>
                    <span class="font-semibold">$${product.price}</span>
                </div>
                <button class="add-btn w-full py-2 rounded color-primary text-white button-hover">
                    Add to Cart
                </button>
            </div>
        `;
        card.querySelector(".product-title").addEventListener("click", () => loadProductDetail(product.id));
        card.querySelector(".add-btn").addEventListener("click", () => addToCart(product));
        container.appendChild(card);
    });
};

const loadCategories = async () => {
    const res = await fetch("https://fakestoreapi.com/products/categories");
    const categories = await res.json();
    displayCategories(categories);
};

const loadCategoryProducts = async (category) => {
    manageSpinner(true);
    const encoded = encodeURIComponent(category);
    const res = await fetch(`https://fakestoreapi.com/products/category/${encoded}`);
    const data = await res.json();
    displayProducts(data);
    manageSpinner(false);
};

const displayCategories = (categories) => {
    const container = document.getElementById("categories-container");
    container.innerHTML = "";
    categories.forEach(category => {
        const btn = document.createElement("button");
        btn.textContent = category;
        btn.className = "color-secondary w-full text-left mb-2 button-hover categories-btn px-3 py-2 rounded-lg";
        btn.addEventListener("click", () => {
            removeActiveCategory();
            btn.classList.add("active");
            loadCategoryProducts(category);
        });
        container.appendChild(btn);
    });
};

const removeActiveCategory = () => {
    document.querySelectorAll(".categories-btn").forEach(btn => btn.classList.remove("active"));
};

loadAllProducts();
loadCategories();
