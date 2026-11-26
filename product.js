//Single Product Page

export function makeStars(rating) {
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


//Shows the breadcrumb at the top of the Single Product view:
//Home > Category > Product Title

export function renderBreadcrumb(product) {
    const crumb = document.querySelector("#product-breadcrumb");
    crumb.textContent = `Home › ${product.category} › ${product.title}`;
}