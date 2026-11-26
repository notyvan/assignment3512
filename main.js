import config from './data/data-minifed.json' with { type: 'json' };
import { setUpFilterAccordions, buildCategoryFilters, getFilters, filterProducts, sortProducts, setUpBrowseFilters } from './browse.js';

// Helper Functions
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);
const _ = (createElement) => document.createElement(createElement);


document.addEventListener('DOMContentLoaded', () => {


    // Trying to do adding to cart updating
    // Cart updated in header but havent done anything for cart screen
    const cart = [];
    let currentProduct = null;

    function updateCartCount() {
        let total = 0;
        for (let item of cart) {
            total += item.quantity;
        }
        $("#cart-count").textContent = total;
    }

    function addToCart(product, quantity) {
        const existing = cart.find(item => item.product.id === product.id)
        const inCart = existing ? existing.quantity : 0;

        if (inCart + quantity > product.stock) {
            alert(`Only ${product.stock} in stock, have ${inCart} greedy boy`);
            return false;
        }

        if (existing) {
            existing.quantity += quantity;
        } else {
            cart.push({product: product, quantity: quantity});
        }

        updateCartCount();
        return true;
    }
    

    const singleProductAdd = $("#product-add");
    singleProductAdd.addEventListener("click", () => {
        const qty = parseInt($("#product-qty").value);

        if (isNaN(qty) || qty < 1) {
            alert("Do it right");
            return;
        }

        addToCart(currentProduct, qty);
    });
// End of cart



    // nav link and view swtiching
    const views = $$(".view");
    const navLinks = $$(".navbar a");

    function showView(name) {
        for (let v of views) {
            v.classList.add("hidden");
        }
        $(`#${name}`).classList.remove("hidden");

    }

    for (let n of navLinks) {
        n.addEventListener("click", (e) => {
            e.preventDefault();
            showView(n.dataset.view);
        });
    }
    // End of view switching


    // Singel product
    function makeStars(rating) {
        const full = Math.round(rating);
        let stars = "";

        for (let i = 0; i < 5; i++) {
            if (i < full) {
                stars += "★";
            } else {
                stars += "☆";
            }
        }
        return stars;
    }

    function showProduct(product) {
        currentProduct = product;
        $("#product-image").src = product.images[0];
        $("#product-image").alt = product.title;
        $("#product-title").textContent = product.title;
        $("#product-price").textContent = `$${product.price}`;
        $("#product-sku").textContent = `SKU $${product.sku}`;
        $("#product-rating").textContent = makeStars(product.rating);
        $("#product-stock").textContent = product.stock;
        $("#product-description").textContent = product.description;
        $("#product-qty").value = 1;

        const tagsBox = $("#product-tags");

        for (let tag of product.tags) {
            // console.log(tag);
            const span = _("span");
            span.classList.add("tag");
            span.textContent = tag;
            tagsBox.appendChild(span);
        }

        // Havent added the specification and reviews, i kinda wanna clean up my function but too lazy
        showView("product");
    }

    // end of single product

   

    //  Browse view functionality
    const productsContainer = $('#product-container');

    //Draws the Browse grid using the sort and current filters.
    function renderBrowse(){
        const filters = getFilters();
        const matches = sortProducts(filterProducts(config.products, filters), filters.sortBy);

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
        buildCategoryFilters(config.products);
        setUpBrowseFilters(renderBrowse);
        renderBrowse();


});
// https://salonimehta27.medium.com/building-single-page-application-project-in-javascript-b55b767fdf53 

// function findMatch(product) {
// const id = product.target.dataset.id;
    // let match;
    // for (let p of product) {
        // if (p.id == id) {
            // match = p;
            // break;
        // }
    // }
    // if (match) {
        // do whatever
    // }
// 
// }



