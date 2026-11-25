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

    for(const category of categories){
        const label = document.createElement("label");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = category;

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(" " + category));
        box.appendChild(label);
    }
}

//Builds one checkbox per rating.