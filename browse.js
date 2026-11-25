// Browse View

export function setUpFilterAccordions(){
    const panel = document.querySelector(".browse-filters");

    panel.addEventListener("click", (e) => {
        if(e.target.classList.contains("filter-toggle")){
            const body = e.target.nextElementSibling;
            body.classList.toggle("hidden");
        }
    });
}

//Builds one checkbox per category.
export function buildCategoryFilters(products) {
    // 1. Collect unique categories (a Set ignores duplicates)
    const categorySet = new Set();
    for (const p of products) {
        categorySet.add(p.category);
    }

    // 2. Copy the Set into an array so it can be sorted A-Z
    const categories = [];
    for (const c of categorySet) {
        categories.push(c);
    }
    categories.sort();

    // 3. Make a checkbox for each category
    const box = document.querySelector("#browse-categories");
    box.innerHTML = "";

    for(let category of categories){
        const label = document.createElement("label");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = category;

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(" " + category));
        box.appendChild(label);
    }
}


// Reads the filter values from the form and returns them as an object.
export function getFilters() {
    const categories = [];
    for (let box of document.querySelectorAll("#browse-categories input:checked")) {
        categories.push(box.value);
    }

    const ratings = [];
    for (const box of document.querySelectorAll("#browse-ratings input:checked")) {
        ratings.push(Number(box.value));
    }

    return {
        name: document.querySelector("#browse-name").value.trim().toLowerCase(),
        categories: categories,
        ratings: ratings,
        useUnder: document.querySelector("#browse-under-check").checked,
        under: Number(document.querySelector("#browse-under").value),
        useOver: document.querySelector("#browse-over-check").checked,
        over: Number(document.querySelector("#browse-over").value),
        sortBy: document.querySelector("#browse-sort").value
    };
}

// Filters the products based on the filters object.
export function filterProducts(products, filters) {
    return products.filter(p => {
        if (filters.name && !p.title.toLowerCase().includes(filters.name)) {
            return false;
        }
        if (filters.categories.length > 0 && !filters.categories.includes(p.category)) {
            return false;
        }
        if (filters.ratings.length > 0 && !filters.ratings.includes(Math.round(p.rating))) {
            return false;
        }
        if (filters.useUnder && p.price >= filters.under) {
            return false;
        }
        if (filters.useOver && p.price <= filters.over) {
            return false;
        }
        return true;
    });
}

// Sorts products by product name (A-Z), price (low to high) or category.
export function sortProducts(list, sortBy) {
    return list.sort((a, b) => {
        if (sortBy === "price") {
            return a.price - b.price;
        }
        if (a[sortBy] < b[sortBy]) return -1;
        if (a[sortBy] > b[sortBy]) return 1;
        return 0;
    });
}

// Redraws the results when a filter or the sort changes.
// Clear All resets the filters but NOT the sort (requirement).
export function setUpBrowseFilters(onChange) {
    // One listener for every input in the sidebar (event delegation)
    document.querySelector(".browse-filters").addEventListener("input", onChange);
    document.querySelector("#browse-sort").addEventListener("change", onChange);

    document.querySelector("#browse-clear").addEventListener("click", () => {
        for (let input of document.querySelectorAll(".browse-filters input")) {
            if (input.type === "checkbox") {
                input.checked = false;
            } else {
                input.value = "";
            }
        }
        onChange();
    });
}

