'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { 
  Search, 
  MapPin, 
  Filter, 
  Grid, 
  List, 
  Plus,
  ChevronDown,
  X,
  SlidersHorizontal,
  Loader2,
  Star,
  Clock,
  ShoppingBag,
  Utensils
} from 'lucide-react';
import { getListings, getListingsNearby } from '@/lib/api/listings';
import { getCategories, getCategoriesTree } from '@/lib/api/categories';
import { getRestaurants } from '@/lib/api/restaurants';
import type { ListingWithSeller, Category, CategoryWithChildren, RestaurantWithOwner, ListingFilters, GeoPoint } from '@/types';

// Dynamic import for MapSearch (avoids SSR issues with Leaflet)
const MapSearch = dynamic(() => import('@/components/map/MapSearch'), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] bg-gray-100 rounded-xl flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="text-gray-500">Loading map...</span>
      </div>
    </div>
  ),
});

type ViewMode = 'grid' | 'list' | 'map';
type ContentType = 'all' | 'listings' | 'restaurants';

export default function MarketplacePage() {
  // State
  const [contentType, setContentType] = useState<ContentType>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [listings, setListings] = useState<ListingWithSeller[]>([]);
  const [restaurants, setRestaurants] = useState<RestaurantWithOwner[]>([]);
  const [categories, setCategories] = useState<CategoryWithChildren[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [userLocation, setUserLocation] = useState<GeoPoint | null>(null);
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({ min: '', max: '' });
  const [condition, setCondition] = useState<string[]>([]);

  // Fetch user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // Default to NYC
          setUserLocation({ lat: 40.7128, lng: -74.006 });
        }
      );
    }
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await getCategoriesTree();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  // Fetch data based on filters
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    
    const filters: ListingFilters = {
      searchQuery: searchQuery || undefined,
      categoryId: selectedCategory || undefined,
      sortBy: sortBy as ListingFilters['sortBy'],
      minPrice: priceRange.min ? parseFloat(priceRange.min) : undefined,
      maxPrice: priceRange.max ? parseFloat(priceRange.max) : undefined,
      condition: condition.length > 0 ? condition as any : undefined,
    };

    try {
      // Fetch listings
      if (contentType === 'all' || contentType === 'listings') {
        let listingsResult;
        if (userLocation && (sortBy === 'distance')) {
          listingsResult = await getListingsNearby(userLocation, 50000, selectedCategory || undefined);
        } else {
          listingsResult = await getListings(filters);
        }
        setListings(listingsResult.data || []);
      }

      // Fetch restaurants
      if (contentType === 'all' || contentType === 'restaurants') {
        const { data: restaurantsData } = await getRestaurants();
        setRestaurants(restaurantsData || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [contentType, searchQuery, selectedCategory, sortBy, priceRange, condition, userLocation]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Clear filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSortBy('newest');
    setPriceRange({ min: '', max: '' });
    setCondition([]);
  };

  // Has active filters
  const hasActiveFilters = searchQuery || selectedCategory || priceRange.min || priceRange.max || condition.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">HyperLocal</h1>
                <p className="text-xs text-gray-500">Buy & sell locally</p>
              </div>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-xl w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for items, restaurants..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Location */}
              <button className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                <MapPin className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {userLocation ? 'Near you' : 'Set location'}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {/* Create Listing */}
              <Link
                href="/listings/new"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Sell</span>
              </Link>
            </div>
          </div>

          {/* Content Type Tabs */}
          <div className="flex items-center gap-4 mt-4 overflow-x-auto pb-2">
            <button
              onClick={() => setContentType('all')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                contentType === 'all' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Grid className="w-4 h-4" />
              Everything
            </button>
            <button
              onClick={() => setContentType('listings')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                contentType === 'listings' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              Items for Sale
            </button>
            <button
              onClick={() => setContentType('restaurants')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                contentType === 'restaurants' 
                  ? 'bg-red-100 text-red-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Utensils className="w-4 h-4" />
              Restaurants
            </button>

            <div className="flex-1" />

            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-500'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'map' ? 'bg-white shadow-sm' : 'text-gray-500'
                }`}
              >
                <MapPin className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                showFilters || hasActiveFilters
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="bg-white text-blue-600 text-xs px-1.5 py-0.5 rounded-full">
                  {[searchQuery, selectedCategory, priceRange.min, priceRange.max, condition.length > 0].filter(Boolean).length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="border-t bg-white p-4">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-wrap gap-4 items-end">
                {/* Category */}
                <div className="min-w-[200px]">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Category
                  </label>
                  <select
                    value={selectedCategory || ''}
                    onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <div className="min-w-[150px]">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Sort by
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="distance">Nearest First</option>
                  </select>
                </div>

                {/* Price Range */}
                <div className="flex items-center gap-2">
                  <div className="w-24">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Min Price
                    </label>
                    <input
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                      placeholder="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <span className="text-gray-400">-</span>
                  <div className="w-24">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Max Price
                    </label>
                    <input
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                      placeholder="Any"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
                  >
                    <X className="w-4 h-4" />
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Map View */}
        {viewMode === 'map' && (
          <div className="mb-6">
            <MapSearch 
              initialCenter={userLocation || undefined}
              categoryId={selectedCategory || undefined}
            />
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-600">
                {contentType !== 'restaurants' && (
                  <span className="font-medium">{listings.length}</span>
                )}
                {contentType === 'all' && ' items, '}
                {contentType !== 'listings' && (
                  <span className="font-medium">{restaurants.length}</span>
                )}
                {contentType === 'all' ? ' restaurants' : contentType === 'listings' ? ' items for sale' : ' restaurants'}
                {searchQuery && ` matching "${searchQuery}"`}
              </p>
            </div>

            {/* Listings Grid/List */}
            {viewMode !== 'map' && (
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' 
                  : 'space-y-4'
              }>
                {/* Listings */}
                {(contentType === 'all' || contentType === 'listings') && listings.map((listing) => (
                  <Link
                    key={listing.id}
                    href={`/listings/${listing.id}`}
                    className={`bg-white rounded-xl overflow-hidden border hover:shadow-lg transition-shadow ${
                      viewMode === 'list' ? 'flex' : ''
                    }`}
                  >
                    {/* Image */}
                    <div className={`relative ${viewMode === 'list' ? 'w-48 h-32 flex-shrink-0' : 'aspect-square'}`}>
                      {listing.images && listing.images.length > 0 ? (
                        <img
                          src={listing.images[0]}
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <ShoppingBag className="w-8 h-8 text-gray-300" />
                        </div>
                      )}
                      {listing.condition && (
                        <span className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded capitalize">
                          {listing.condition}
                        </span>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="p-4 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-gray-900 line-clamp-2">
                          {listing.title}
                        </h3>
                        <span className="text-green-600 font-bold whitespace-nowrap">
                          ${listing.price.toLocaleString()}
                        </span>
                      </div>
                      
                      {viewMode === 'list' && listing.description && (
                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                          {listing.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                        <MapPin className="w-3 h-3" />
                        {listing.distance_meters 
                          ? `${(listing.distance_meters / 1000).toFixed(1)} km away`
                          : listing.address || 'Location not specified'
                        }
                      </div>
                      
                      {viewMode === 'list' && (
                        <div className="flex items-center gap-3 mt-3 pt-3 border-t">
                          {listing.seller_avatar && (
                            <img
                              src={listing.seller_avatar}
                              alt={listing.seller_full_name || 'Seller'}
                              className="w-6 h-6 rounded-full"
                            />
                          )}
                          <span className="text-sm text-gray-600">
                            {listing.seller_full_name || listing.seller_username || 'Unknown seller'}
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}

                {/* Restaurants */}
                {(contentType === 'all' || contentType === 'restaurants') && restaurants.map((restaurant) => (
                  <Link
                    key={restaurant.id}
                    href={`/restaurants/${restaurant.id}`}
                    className={`bg-white rounded-xl overflow-hidden border hover:shadow-lg transition-shadow ${
                      viewMode === 'list' ? 'flex' : ''
                    }`}
                  >
                    {/* Image */}
                    <div className={`relative ${viewMode === 'list' ? 'w-48 h-32 flex-shrink-0' : 'aspect-video'}`}>
                      {restaurant.cover_image_url ? (
                        <img
                          src={restaurant.cover_image_url}
                          alt={restaurant.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-red-50 flex items-center justify-center">
                          <Utensils className="w-8 h-8 text-red-200" />
                        </div>
                      )}
                      {restaurant.is_verified && (
                        <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                          <Star className="w-3 h-3" /> Verified
                        </span>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="p-4 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-gray-900">
                          {restaurant.name}
                        </h3>
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="font-medium">{restaurant.rating.toFixed(1)}</span>
                          <span className="text-gray-400 text-sm">({restaurant.review_count})</span>
                        </div>
                      </div>
                      
                      {viewMode === 'list' && restaurant.description && (
                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                          {restaurant.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                        {restaurant.cuisine_types && (
                          <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                            {restaurant.cuisine_types.slice(0, 2).join(', ')}
                          </span>
                        )}
                        {restaurant.price_range && (
                          <span className="text-green-600 font-medium">
                            {restaurant.price_range}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <MapPin className="w-3 h-3" />
                        {restaurant.address || 'Location not specified'}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && listings.length === 0 && restaurants.length === 0 && (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">No results found</h3>
                <p className="text-gray-500 mt-1">
                  Try adjusting your filters or search terms
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 px-4 py-2 text-blue-600 font-medium hover:underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
