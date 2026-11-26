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


// Tabs: Specifications and Reviews 

export function renderSpecs(product) {
    const panel = document.querySelector("#product-specs");
    panel.innerHTML = "";

    const d = product.dimensions;
    const specs = [
        { label: "Weight", value: `${product.weight} kg` },
        { label: "Dimensions", value: `${d.width} × ${d.height} × ${d.depth} cm` },
        { label: "Warranty", value: product.warrantyInformation },
        { label: "Shipping", value: product.shippingInformation },
        { label: "Return Policy", value: product.returnPolicy }
    ];

    const table = document.createElement("table");
    table.classList.add("spec-table");

    for (const spec of specs) {
        const row = document.createElement("tr");
        const name = document.createElement("th");
        const value = document.createElement("td");
        name.textContent = spec.label;
        value.textContent = spec.value;
        row.appendChild(name);
        row.appendChild(value);
        table.appendChild(row);
    }

    panel.appendChild(table);
}

//Fills the Reviews tab: stars, comment, formatted date and reviewer name

export function renderReviews(product) {
    const panel = document.querySelector("#product-reviews");
    panel.innerHTML = "";

    for (const r of product.reviews) {
        const review = document.createElement("div");
        review.classList.add("review");

        const stars = document.createElement("p");
        stars.classList.add("review-stars");
        stars.textContent = makeStars(r.rating);

        const comment = document.createElement("p");
        comment.classList.add("review-comment");
        comment.textContent = r.comment;

        const info = document.createElement("p");
        info.classList.add("review-info");
        info.textContent = `${r.reviewerName} · ${formatDate(r.date)}`;

        review.appendChild(stars);
        review.appendChild(comment);
        review.appendChild(info);
        panel.appendChild(review);
    }
}

//Formats the date in the format of Month Day, Year

function formatDate(isoDate) {
    return new Date(isoDate).toLocaleDateString("en-CA", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}

//Shows the active tab and hides the inactive tab between Specifications and Reviews

function showProductTab(name) {
    for (const tab of document.querySelectorAll(".product-tab")) {
        if (tab.dataset.tab === name) {
            tab.classList.add("active");
        } else {
            tab.classList.remove("active");
        }
    }

    if (name === "specs") {
        document.querySelector("#product-specs").classList.remove("hidden");
        document.querySelector("#product-reviews").classList.add("hidden");
    } else {
        document.querySelector("#product-reviews").classList.remove("hidden");
        document.querySelector("#product-specs").classList.add("hidden");
    }
}

//Sets up the event listeners for the product tabs
//When a tab is clicked, it shows the active tab and hides the inactive tab

export function setUpProductTabs() {
    document.querySelector(".product-tabs").addEventListener("click", (e) => {
        if (e.target.classList.contains("product-tab")) {
            showProductTab(e.target.dataset.tab);
        }
    });
}