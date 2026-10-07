export function saveFavorites(favorites) {
	const favoriteIds = [...favorites];

	localStorage.setItem("favorite-product-ids", JSON.stringify(favoriteIds));
}

export function loadFavorites() {
	const storedFavorites = localStorage.getItem("favorite-product-ids");
	if (!storedFavorites) {
		return new Set();
	}

	try {
		const favoriteIds = JSON.parse(storedFavorites);

		if (!Array.isArray(favoriteIds)) {
			localStorage.removeItem("favorite-product-ids");
			return new Set();
		}
		return new Set(favoriteIds);
	} catch (error) {
		console.error("Could not load favorites:", error);
		localStorage.removeItem("favorite-product-ids");
		return new Set();
	}
}
