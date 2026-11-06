import config from './data/data-minifed.json' with { type: 'json' };

// Helper Functions
const $ = (selector) => document.querySelector(selector);
// const $$ = (selector) => document.querySelectorAll(selector); since it's not used yet, comment for now
const _ = (createElement) => document.createElement(createElement);
const productsContainer = $('#product-container');

document.addEventListener('DOMContentLoaded', () => {
    // List first 20 products of the json
    for (let i = 0; i < 20; i++) {
        const productElement = createProductElement(config.products[i]);
        productsContainer.appendChild(productElement);
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
    productBtn.setAttribute('aria-label', `Add ${product.title} to cart`);
   

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
        alert(`Product ID: ${product.id}`);
    });

    productBtn.addEventListener('click', () => {
        alert(`Product ID: ${product.id}, ${product.title} has been Added to Cart`)
    });


    return productElement;
}

});




