// fetch api shit
// take data from api
// dynamically create elements and append to the dom
import config from './data/data-minifed.json' with { type: 'json' };


// for (let p of config.products) {
    // console.log(p);    
// }
// 

const productsContainer = document.querySelector('#product-container');

for (let i = 0; i < 10; i++) {
    console.log(config.products[i]);
    const productElement = createProductElement(config.products[i]);
    productsContainer.appendChild(productElement);
}


function createProductElement(product) {
    const productElement = document.createElement('div');
    productElement.classList.add('item');
    const productImageElement = document.createElement('img');
    productImageElement.src = product.thumbnail;
    productImageElement.width = 200;
    const productNameElement = document.createElement('h1');
    productNameElement.textContent = product.title;
    const productPriceElement = document.createElement('p');
    productPriceElement.textContent = `$${product.price}`;


    productElement.appendChild(productImageElement);
    productElement.appendChild(productNameElement);
    productElement.appendChild(productPriceElement);
    return productElement;
}