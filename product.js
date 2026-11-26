//Single Product Page
//Shows the breadcrumb at the top of the Single Product view:

export function renderBreadcrumb(product) {
    const crumb = document.querySelector("#product-breadcrumb");
    crumb.textContent = `Home › ${product.category} › ${product.title}`;
}