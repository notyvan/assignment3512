//Data fetch and local storage 

const API_URL = "https://dummyjson.com/products?limit=100";
const STORAGE_KEY = "products";

//Fetch products from API

export async function getProducts() {
    //first try to get products from local storage

    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved) {
        return saved;
    }

    //if no products in local storage, fetch from API

    try {
        const resp = await fetch(API_URL);

        if (!resp.ok) {
            throw new Error("fetch failed");
        }
    
    const data = await resp.json();

    //save to local storage

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data.products));

    return data.products;

    } catch (err) {
        console.error(err);
        return [];
    }
}
