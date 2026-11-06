import config from './data/data-minifed.json' with { type: 'json' };

document.addEventListener('DOMContentLoaded', () => {
    const productsContainer = $('#product-container');
    
    for (let i = 0; i <= 20; i++) {
        const productElement = createProductElement(config.products[i]);
        productsContainer.appendChild(productElement);
    }

    function createProductElement(product) {
    // Create Div
    const productElement = document.createElement('div');
    productElement.classList.add('item');

    // Create Image
    const productImageElement = _('img');
    productImageElement.src = product.thumbnail;
    productImageElement.width = 200;
    const productNameElement = _('h2');
    productNameElement.textContent = product.title;
    const productPriceElement = _('p');
    productPriceElement.textContent = `$${product.price}`;

    const productBtn = _('button');
    productBtn.classList.add('add');
    productBtn.textContent = '+';


    productElement.appendChild(productImageElement);
    productElement.appendChild(productNameElement);
    productElement.appendChild(productPriceElement);
    productElement.appendChild(productBtn);
    return productElement;
}

    

});




// for (let p of config.products) {
    // console.log(p);    
// }
// 

// const productsContainer = document.querySelector('#product-container');

// for (let i = 0; i < 10; i++) {
// console.log(config.products[i]);
    // const productElement = createProductElement(config.products[i]);
    // productsContainer.appendChild(productElement);
// }







// Helper Functions

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);
const _ = (createElement) => document.createElement(createElement);