/**
 * ServiceController handles all operations related to services, 
 * including creating, updating, deleting services, and managing service caching.
 * 
 * Author: Ahmed Aredah
 */

import { ServiceModel } from '../models/services.model.js';

class ServiceController {
    constructor() {
        // Initialize cache
        this.cache = {
            allServices: null,
            categoryServices: {},
            searchCache: {},
            searchCacheMaxSize: 100,  // Limit cache size
            lastUpdated: null,
            cacheDuration: 60 * 60 * 1000 // 1 hour cache duration
        };
        
        // Bind methods
        this.getAllServices = this.getAllServices.bind(this);
        this.getServicesByCategory = this.getServicesByCategory.bind(this);
        this.searchServices = this.searchServices.bind(this);
        this.createService = this.createService.bind(this);
        this.updateService = this.updateService.bind(this);
        this.deleteService = this.deleteService.bind(this);
        this.invalidateCache = this.invalidateCache.bind(this);
        this.isCacheValid = this.isCacheValid.bind(this);
        this.manageSearchCache = this.manageSearchCache.bind(this);
    }

    // Check if cache is still valid
    isCacheValid() {
        if (!this.cache.lastUpdated) return false;
        const now = Date.now();
        return (now - this.cache.lastUpdated) < this.cache.cacheDuration;
    }

    // Invalidate the entire cache or specific parts
    invalidateCache(specificCache = null) {
        if (specificCache) {
            if (specificCache === 'allServices') this.cache.allServices = null;
            else if (specificCache === 'categoryServices') this.cache.categoryServices = {};
            else if (specificCache === 'searchCache') this.cache.searchCache = {};
            else if (this.cache.categoryServices[specificCache]) this.cache.categoryServices[specificCache] = null;
        } else {
            this.cache = {
                allServices: null,
                categoryServices: {},
                searchCache: {},
                lastUpdated: null,
                cacheDuration: this.cache.cacheDuration,
                searchCacheMaxSize: this.cache.searchCacheMaxSize
            };
        }
      }

    async getAllServices(req, res) {
        try {
            // Check cache first
            if (this.isCacheValid() && this.cache.allServices) {
                return res.status(200).json({
                    services: this.cache.allServices,
                    fromCache: true
                });
            }

            // Query database if cache is invalid
            const services = await ServiceModel.find()
                .sort({ category: 1, name: 1 })
                .lean();

            // Update cache
            this.cache.allServices = services;
            this.cache.lastUpdated = Date.now();

            return res.status(200).json({
                services,
                fromCache: false
            });
        } catch (error) {
            console.error("Error in getAllServices:", error);
            return res.status(500).json({
                message: 'Error fetching services',
                error: error.message
        });
        }
    }

    async getServicesByCategory(req, res) {
        try {
            const { category } = req.params;

            // Check cache first
            if (this.isCacheValid() && this.cache.categoryServices[category]) {
                return res.status(200).json({
                    services: this.cache.categoryServices[category],
                    category,
                    fromCache: true
                });
            }

            // Query database if cache is invalid
            const services = await ServiceModel.find({ category })
                .sort({ name: 1 })
                .lean();

            // Update cache
            this.cache.categoryServices[category] = services;
            this.cache.lastUpdated = Date.now();

            return res.status(200).json({
                services,
                category,
                fromCache: false
            });
        } catch (error) {
            console.error("Error in getServicesByCategory:", error);
            return res.status(500).json({
                message: 'Error fetching services by category',
                error: error.message
            });
        }
    }

    // Search services by query and/or category
    // Query parameters: query, category
    ////////
    //// Example: Search for oil change services
    // fetch('/api/services/search?query=oil+change')
    // // Example: Filter by category
    // fetch('/api/services/search?category=maintenance')
    // // Example: Combine both filters
    // fetch('/api/services/search?query=oil+change&category=maintenance')
    async searchServices(req, res) {
        try {
            const { query, category } = req.query;

            // Create a cache key from the search parameters
            const cacheKey = `${query || ''}_${category || ''}`;
            
            // Check cache first
            if (this.isCacheValid() && this.cache.searchCache[cacheKey]) {
            return res.status(200).json({
                services: this.cache.searchCache[cacheKey],
                count: this.cache.searchCache[cacheKey].length,
                fromCache: true
            });
            }
            
            // Build search criteria
            const searchCriteria = {};
            
            if (query) {
                searchCriteria.$text = { $search: query };
            }
            
            if (category) {
                searchCriteria.category = category;
            }
            
            // Execute search
            const services = await ServiceModel.find(searchCriteria)
                .sort({ score: { $meta: "textScore" } })
                .lean();

            // Add to cache (with size management)
            this.manageSearchCache(cacheKey, services);
            
            return res.status(200).json({
                services,
                count: services.length
            });
        } catch (error) {
            console.error("Error in searchServices:", error);
            return res.status(500).json({
                message: 'Error searching services',
                error: error.message
            });
        }
    }

    // Admin methods to manage services
    async createService(req, res) {
        try {
            const serviceData = req.body;
            
            // Validate required fields
            const requiredFields = ['name', 'category', 'description'];
            const missingFields = requiredFields.filter(field => !serviceData[field]);
            
            if (missingFields.length > 0) {
                return res.status(400).json({
                message: 'Missing required fields',
                missingFields
                });
            }
            
            // Check if service with same name already exists
            const existingService = await ServiceModel.findOne({ name: serviceData.name });
            if (existingService) {
                return res.status(400).json({
                message: 'Service with this name already exists'
                });
            }
            
            // Create new service
            const newService = new ServiceModel(serviceData);
            await newService.save();
            
            // Invalidate cache to reflect changes
            this.invalidateCache();
            
            return res.status(201).json({
                message: 'Service created successfully',
                service: newService
            });
        } catch (error) {
            console.error("Error in createService:", error);
            return res.status(500).json({
                message: 'Error creating service',
                error: error.message
            });
        }
    }

    async updateService(req, res) {
        try {
            const { serviceId } = req.params;
            const updateData = req.body;
            
            const updatedService = await ServiceModel.findByIdAndUpdate(
                serviceId,
                { $set: updateData },
                { new: true }
            );
            
            if (!updatedService) {
                return res.status(404).json({
                message: 'Service not found'
                });
            }
            
            // Invalidate cache to reflect changes
            this.invalidateCache();
            
            return res.status(200).json({
                message: 'Service updated successfully',
                service: updatedService
            });
        } catch (error) {
            console.error("Error in updateService:", error);
            return res.status(500).json({
                message: 'Error updating service',
                error: error.message
            });
        }
    }

    async deleteService(req, res) {
        try {
            const { serviceId } = req.params;
            
            const deletedService = await ServiceModel.findByIdAndDelete(serviceId);
            
            if (!deletedService) {
                return res.status(404).json({
                message: 'Service not found'
                });
            }
            
            // Invalidate cache to reflect changes
            this.invalidateCache();
            
            return res.status(200).json({
                message: 'Service deleted successfully'
            });
        } catch (error) {
            console.error("Error in deleteService:", error);
            return res.status(500).json({
                message: 'Error deleting service',
                error: error.message
            });
        }
    }

    // Helper method to manage search cache
    manageSearchCache(key, data) {
        // Add the new entry
        this.cache.searchCache[key] = data;
        
        // Check if cache is too large
        const cacheKeys = Object.keys(this.cache.searchCache);
        if (cacheKeys.length > this.cache.searchCacheMaxSize) {
          // Remove oldest entries (first 20% of max size)
          const keysToRemove = cacheKeys.slice(0, Math.ceil(this.cache.searchCacheMaxSize * 0.2));
          keysToRemove.forEach(k => delete this.cache.searchCache[k]);
        }
        
        this.cache.lastUpdated = Date.now();
      }
}

export default ServiceController;