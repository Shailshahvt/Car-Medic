class LocalStorage {
	static setItem(key, value) {
		// Only store valid values
		if (value === undefined) {
			console.warn(`Attempted to store undefined for key: ${key}`);
			return;
		}
		localStorage.setItem(key, JSON.stringify(value)); 
		window.dispatchEvent(new Event("storage"));
	}
	
	static getItem(key) {
		const item = localStorage.getItem(key);
		// Check if the item is missing or is the literal string "undefined"
		if (!item || item === "undefined") {
			return null;
		}
		try {
			return JSON.parse(item);
		} catch (error) {
			console.error(`Error parsing localStorage item "${key}":`, error);
			return null;
		}
	}
	
	static removeItem(key) {
		localStorage.removeItem(key);
		window.dispatchEvent(new Event("storage")); 
	}

	// New methods for authentication
	static setToken(token) {
		this.setItem("token", token);
	}

	static getToken() {
		return this.getItem("token");
	}

	static removeToken() {
		this.removeItem("token");
	}

	static setUser(userData) {
		this.setItem("user", userData);
	}

	static getUser() {
		return this.getItem("user");
	}

	static removeUser() {
		this.removeItem("user");
	}

	static isAuthenticated() {
		return !!this.getToken();
	}

	static clearAuth() {
		this.removeToken();
		this.removeUser();
		window.dispatchEvent(new Event("storage")); 
	}

	static ensureTokenAvailability() {
		const token = localStorage.getItem("token");
		if (token) {
			localStorage.setItem("token", token);
		}
	}

	static checkForAppRebuild() {
		const currentBuildId = "my-app-build-v1"; 
		const savedBuildId = localStorage.getItem("app_build_id");

		if (savedBuildId !== currentBuildId) {
			this.clearAuth();
			localStorage.setItem("app_build_id", currentBuildId); 
		}
	}

	static rehydrateTokenIfNeeded() {
		const rawToken = localStorage.getItem("token");

		if (rawToken && rawToken !== "undefined" && this.getItem("token") === null) {
			console.log("[LocalStorage] Rehydrating raw token...");
			this.setItem("token", rawToken);
		}
	}
}

LocalStorage.ensureTokenAvailability();
LocalStorage.checkForAppRebuild();

export default LocalStorage;
