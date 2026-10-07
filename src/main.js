import './style.css'
import { products } from './products.js'
import { saveFavorites, loadFavorites } from './storage.js';

const searchInput = document.querySelector("#search-input");
const categoryFilter = document.querySelector("#category-filter");
const sortOrder = document.querySelector("#sort-order");
const resultCount = document.querySelector("#result-count");
const productList = document.querySelector("#product-list");
const favoritesOnly = document.querySelector("#favorites-only");

const state = {
	query: "",
	category: "all",
	sort: "default",
	favorites: loadFavorites(),
	favoritesOnly: false
};

const validCategories = new Set([
	"all",
	"electronics",
	"books",
	"clothing"
]);

const validSorts = new Set([
	"default",
	"price-asc",
	"price-desc",
	"name"
]);


function loadStateFromUrl() {
	const params = new URLSearchParams(window.location.search);

	const query = (params.get("q") ?? "");
	const category = params.get("category") ?? "all";
	const sort = params.get("sort") ?? "default";

	state.query = query.trim().toLowerCase();
	state.category = validCategories.has(category) ? category : "all";
	state.sort = validSorts.has(sort) ? sort : "default";

	searchInput.value = state.query;
	categoryFilter.value = state.category;
	sortOrder.value = state.sort;
}

function syncUrl() {
	const params = new URLSearchParams();

	if (state.query) {
		params.set("q", state.query);
	}

	if (state.category !== "all") {
		params.set("category", state.category);
	}

	if (state.sort !== "default") {
		params.set("sort", state.sort);
	}

	const queryString = params.toString();
	const nextUrl = queryString ? `?${queryString}` : window.location.pathname;

	window.history.replaceState(null, "", nextUrl);
}

function updateView() {
	syncUrl();

	const visibleProducts = products.filter((product) => {
		const matchesSearch = product.name.toLowerCase().includes(state.query);

		const matchesCategory = state.category === "all" || product.category === state.category;

		const matchesFavorite = !state.favoritesOnly || state.favorites.has(product.id);

		return matchesSearch && matchesCategory && matchesFavorite;
	});

	if (state.sort === "price-asc") {
		visibleProducts.sort((a, b) => a.price - b.price);
	} else if (state.sort === "price-desc") {
		visibleProducts.sort((a, b) => b.price - a.price);
	} else if (state.sort === "name") {
		visibleProducts.sort((a, b) => a.name.localeCompare(b.name));
	}

	renderProducts(visibleProducts);
}

function renderProducts(items) {
	productList.replaceChildren();

	const label = items.length === 1 ? "product" : "products";
	resultCount.textContent = `${items.length} ${label}`;

	if (items.length === 0) {
		const status = document.createElement("p");
		status.textContent = "No products match your filters.";
		status.classList.add("empty-state");

		productList.appendChild(status);
		return;
	}

	for (const product of items) {
		const productItem = document.createElement("article");
		productItem.className = "product-card";

		const name = document.createElement("h2");
		const category = document.createElement("p");
		const description = document.createElement("p");
		const price = document.createElement("p");

		category.className = "product-category";
		description.className = "product-description";
		price.className = "product-price";

		name.textContent = product.name;
		category.textContent = product.category;
		description.textContent = product.description;
		price.textContent = `$${product.price.toFixed(2)}`;

		const favoriteButton = document.createElement("button");
		favoriteButton.type = "button";
		favoriteButton.className = "favorite-button";
		favoriteButton.dataset.productId = product.id;

		const isFavorite = state.favorites.has(product.id);
		favoriteButton.textContent = isFavorite ? "Remove favorite" : "Favorite";
		favoriteButton.setAttribute("aria-pressed", String(isFavorite));

		productItem.appendChild(name);
		productItem.appendChild(category);
		productItem.appendChild(description);
		productItem.appendChild(price);
		productItem.appendChild(favoriteButton);

		productList.appendChild(productItem);
	}

}

loadStateFromUrl();
updateView();

searchInput.addEventListener("input", function () {
	state.query = searchInput.value.trim().toLowerCase();
	updateView();
});

categoryFilter.addEventListener("change", function () {
	state.category = categoryFilter.value;
	updateView();
});

sortOrder.addEventListener("change", function () {
	state.sort = sortOrder.value;
	updateView();
});

favoritesOnly.addEventListener("change", function () {
	state.favoritesOnly = favoritesOnly.checked;
	updateView();
});

productList.addEventListener("click", function (event) {
	const favoriteButton = event.target.closest("button[data-product-id]");
	if (!favoriteButton) {
		return;
	}

	const productId = Number(favoriteButton.dataset.productId);

	if (state.favorites.has(productId)) {
		state.favorites.delete(productId);
	} else {
		state.favorites.add(productId);
	}

	saveFavorites(state.favorites);
	updateView();
});
