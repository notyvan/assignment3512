import { setUpFilterAccordions, buildCategoryFilters, getFilters, filterProducts, sortProducts, setUpBrowseFilters } from './browse.js';
import { makeStars, renderBreadcrumb, renderSpecs, renderReviews, setUpProductTabs } from './product.js';
import { showToast } from './toast.js';
import { getProducts } from './data.js';

// Helper Functions
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);
const _ = (createElement) => document.createElement(createElement);








document.addEventListener('DOMContentLoaded', async () => {
    // Load products once (localStorage, or fetch the first time)
    const products = await getProducts();


    //load the saved cart so it persists across page reloads
    const cart = JSON.parse(localStorage.getItem("cart")) || [];



    let currentProduct = null;

    function updateCartCount() {
        // Save the cart every time it changes (add, remove, checkout)
        localStorage.setItem("cart", JSON.stringify(cart));

        let total = 0;
        for (let item of cart) {
            total += item.quantity;
        }
        $("#cart-count").textContent = total;
        renderCart();
    }

    function addToCart(product, quantity) {
        const existing = cart.find(item => item.product.id === product.id)
        const inCart = existing ? existing.quantity : 0;

        if (inCart + quantity > product.stock) {
            showToast(`Sorry, only ${product.stock} in stock (you already have ${inCart} in your cart).`);           
             return false;
        }

        if (existing) {
            existing.quantity += quantity;
        } else {
            cart.push({product: product, quantity: quantity});
        }

        showToast(`Added ${quantity} × ${product.title} to cart`);

        updateCartCount();
        return true;
    }

    const TAX_RATE = 0.05;
    const FREE_SHIPPING = 500;
    const SHIPPING_COSTS = {
        standard: {canada: 10, us: 15, intl: 20},
        express: {canada: 25, us: 25, intl: 30},
        priority: {canada: 35, us: 50, intl: 50}
    };

    function formatMoney(amount) {
        return `$${amount.toFixed(2)}`
    }

    function createCartRow(item) {
        const row = _("tr");

        const deleteCell = _("td");
        const deleteBtn = _("button");
        deleteBtn.type = "button";
        deleteBtn.classList.add("cart-delete");
        deleteBtn.textContent = "-";
        deleteBtn.title = "Remove from Cart";
        deleteBtn.addEventListener("click", () => {
            cart.splice(cart.indexOf(item), 1);
            updateCartCount();
        });
        deleteCell.appendChild(deleteBtn);

        const imageCell = _("td");
        const image = _("img");
        image.src = item.product.thumbnail;
        image.alt = item.product.title;
        image.classList.add("cart-thumb");
        image.addEventListener("click", () => showProduct(item.product));
        imageCell.appendChild(image);

        const titleCell = _("td");
        titleCell.textContent = item.product.title;

        const priceCell = _("td");
        priceCell.textContent = formatMoney(item.product.price);

        const qtyCell = _("td");
        qtyCell.textContent = item.quantity;
        
        const subtotalCell = _("td");
        subtotalCell.textContent = formatMoney(item.product.price * item.quantity);

        row.appendChild(deleteCell);
        row.appendChild(imageCell);
        row.appendChild(titleCell);
        row.appendChild(priceCell);
        row.appendChild(qtyCell);
        row.appendChild(subtotalCell);
        return row
    }

    function getShippingCost(item, method, destination) {
        if (item > FREE_SHIPPING) {
            return 0;
        }
        return SHIPPING_COSTS[method][destination];
    }

    function renderCart() {
        const tbody = $("#cart-items");
        tbody.textContent = "";


        const isEmpty = cart.length === 0;

        if (isEmpty) {
            $("#cart-empty").classList.remove("hidden");
            $(".cart-table").classList.add("hidden");
        } else {
            $("#cart-empty").classList.add("hidden");
            $(".cart-table").classList.remove("hidden");
        }

        $("#cart-shipping-method").disabled = isEmpty;
        $("#cart-destination").disabled = isEmpty;
        $("#cart-checkout").disabled = isEmpty;

        let item = 0;
        for (let i of cart) {
            item += i.product.price * i.quantity;
            tbody.appendChild(createCartRow(i));
        }

        const method = $("#cart-shipping-method").value;
        const destination = $("#cart-destination").value;

        const shipping = isEmpty ? 0 : getShippingCost(item, method, destination);
        const tax = destination === "canada" ? item * TAX_RATE : 0;
        const total = item + shipping + tax;

        $("#cart-merch").textContent = formatMoney(item);
        $("#cart-shipping").textContent = formatMoney(shipping);
        $("#cart-tax").textContent = formatMoney(tax);
        $("#cart-total").textContent = formatMoney(total);
    }


    $("#cart-shipping-method").addEventListener("change", renderCart);
    $("#cart-destination").addEventListener("change", renderCart);

    $("#cart-checkout").addEventListener("click", () => {
        cart.length = 0;
        $("#cart-shipping-method").value = "standard";
        $("#cart-destination").value = "canada";
        updateCartCount();
        showToast("Thank you! Your order has been placed.");
        showView("home");
    });
    

    const singleProductAdd = $("#product-add");
    singleProductAdd.addEventListener("click", () => {
        const qty = parseInt($("#product-qty").value);

        if (isNaN(qty) || qty < 1) {
            showToast("Please enter a quantity of 1 or more.");           
             return;
        }

        addToCart(currentProduct, qty);
    });




    // nav link and view swtiching
    const views = $$(".view");
    const navLinks = $$(".navbar a");

    function showView(name) {
        for (let v of views) {
            v.classList.add("hidden");
        }
        $(`#${name}`).classList.remove("hidden");

        if (name === "cart") {
            renderCart();
        }
    }

  
    for (let n of navLinks) {
        n.addEventListener("click", (e) => {
            e.preventDefault();
            showView(n.dataset.view);
        });
    }
   




    function showProduct(product) {
        currentProduct = product;
        $("#product-image").src = product.images[0];
        $("#product-image").alt = product.title;
        $("#product-title").textContent = product.title;
        $("#product-price").textContent = `$${product.price.toFixed(2)}`;
        $("#product-sku").textContent = product.sku;
        $("#product-rating").textContent = makeStars(product.rating);
        $("#product-description").textContent = product.description;
        $("#product-qty").value = 1;

        // In stock or not (requirement)
        if (product.stock > 0) {
            $("#product-stock").textContent = `In stock (${product.stock} available)`;
        } else {
            $("#product-stock").textContent = "Out of stock";
        }

        // Tags as pills: clear the old product's tags first
        const tagsBox = $("#product-tags");
        tagsBox.innerHTML = "";
        for (let tag of product.tags) {
            const span = _("span");
            span.classList.add("tag");
            span.textContent = tag;
            tagsBox.appendChild(span);
        }

        renderSpecs(product);
        renderReviews(product);

        renderBreadcrumb(product);
        showView("product");
    }

  

   

    //  Browse view functionality
    const productsContainer = $('#product-container');

    //Draws the Browse grid using the sort and current filters.
    function renderBrowse(){
        const filters = getFilters();
        const matches = sortProducts(filterProducts(products, filters), filters.sortBy);
        productsContainer.innerHTML = "";
        for(let p of matches){
            productsContainer.appendChild(createProductElement(p));
        }

        //No products match
        if(matches.length === 0){
            $("#browse-empty").classList.remove("hidden");
        } else {
            $("#browse-empty").classList.add("hidden");
        }

    }
   

    // Function to create product container with
    // Structure: Image, Name, Price, Add to cart
    function createProductElement(product) {

    // Create Product Div
    const productElement = _('div');
    productElement.classList.add('item');

    // Create Image
    const productImageElement = _('img');
    productImageElement.src = product.thumbnail;

    // Create product info div: name, price
    const productInfoElement = _('div');
    productInfoElement.classList.add('info');

    // Create Product Footer Div: productInfo + Add to cartbutton
    const productFooterElement = _('div');
    productFooterElement.classList.add('footer');
    
    // Create Name
    const productNameElement = _('h2');
    productNameElement.textContent = product.title;

    // Create Price
    const productPriceElement = _('p');
    productPriceElement.textContent = `$${product.price}`;

    // Create Add to cart Button
    const productBtn = _('button');
    productBtn.type = 'button';
    productBtn.classList.add('add');
    productBtn.textContent = '+';
    productBtn.dataset.productID = product.id;
   

    // Contain Name and Price element in productInfoElement
    productInfoElement.appendChild(productNameElement);
    productInfoElement.appendChild(productPriceElement);

    // Then contain productInfo into productFooterElement with Add to cart Button
    productFooterElement.appendChild(productInfoElement);
    productFooterElement.appendChild(productBtn);

        
    // Contain Image and Footer into product Element
    productElement.appendChild(productImageElement);
    productElement.appendChild(productFooterElement);
    
    // Create event listeners for add to cart button and image
    productImageElement.addEventListener('click', () => {
        showProduct(product);
    });

    productNameElement.addEventListener('click', () => {
        showProduct(product);
    });

    productBtn.addEventListener('click', () => {
        addToCart(product, 1);
    });



    return productElement;

    
}

        // Browse filters (browse.js)
        setUpFilterAccordions();
        buildCategoryFilters(products);
        setUpBrowseFilters(renderBrowse);
        renderBrowse();

        setUpProductTabs();
        updateCartCount();

});




