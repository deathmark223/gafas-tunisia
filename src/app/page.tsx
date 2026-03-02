                            'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  Search, 
  Menu, 
  X, 
  ShoppingBag, 
  User, 
  Heart,
  MapPin,
  ChevronRight,
  Star,
  Eye,
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  ArrowRight,
  Filter,
  Grid,
  List,
  Plus,
  LogIn
} from 'lucide-react';
import { supabase, getCurrentUser } from '@/lib/supabase/client';
import { getListings } from '@/lib/api/listings';
import type { ListingWithSeller, Category } from '@/types';

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [listings, setListings] = useState<ListingWithSeller[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ListingWithSeller[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkUser();
    fetchListings();
  }, []);

  // Close search on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearch(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search autocomplete
  useEffect(() => {
    const search = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }
      const { data } = await supabase
        .from('listings')
        .select('*')
        .ilike('title', `%${searchQuery}%`)
        .eq('is_active', true)
        .eq('is_sold', false)
        .limit(5);
      setSearchResults(data || []);
    };
    const timer = setTimeout(search, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const checkUser = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
  };

  const fetchListings = async () => {
    const { data } = await getListings();
    setListings(data.slice(0, 8));
    setIsLoading(false);
  };

  // Featured categories
  const categories = [
    { name: 'Sunglasses', slug: 'sunglasses', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400', count: 156 },
    { name: 'Eyeglasses', slug: 'eyeglasses', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400', count: 89 },
    { name: 'Contact Lenses', slug: 'contact-lenses', image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400', count: 45 },
    { name: 'Accessories', slug: 'accessories', image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=400', count: 67 },
  ];

  // Featured products (sample)
  const featuredProducts = [
    { id: '1', name: 'Classic Aviator', brand: 'Ray-Ban', price: 159, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400', rating: 4.8, reviews: 124 },
    { id: '2', name: 'Wayfarer Original', brand: 'Ray-Ban', price: 149, image: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=400', rating: 4.9, reviews: 89 },
    { id: '3', name: 'Clubmaster Browline', brand: 'Ray-Ban', price: 179, image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=400', rating: 4.7, reviews: 56 },
    { id: '4', name: 'Round Metal', brand: 'Oliver Peoples', price: 299, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400', rating: 4.9, reviews: 34 },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              +216 00 000 000
            </span>
            <span className="flex items-center gap-1">
              <Mail className="w-4 h-4" />
              contact@gafas-tunisia.tn
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-yellow-400"><Facebook className="w-4 h-4" /></a>
            <a href="#" className="hover:text-yellow-400"><Instagram className="w-4 h-4" /></a>
            <a href="#" className="hover:text-yellow-400"><Twitter className="w-4 h-4" /></a>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">GAFAS</h1>
                <p className="text-xs text-slate-500">Tunisia</p>
              </div>
            </Link>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8" ref={searchRef}>
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search for sunglasses, eyeglasses, lenses..."
                  className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-full focus:outline-none focus:border-yellow-500"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearch(true);
                  }}
                  onFocus={() => setShowSearch(true)}
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <button 
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-full font-medium transition-colors"
                  onClick={() => {
                    if (searchResults.length > 0) {
                      router.push(`/listings/${searchResults[0].id}`);
                    } else {
                      router.push(`/marketplace?search=${searchQuery}`);
                    }
                  }}
                >
                  Search
                </button>
                {/* Search Autocomplete Dropdown */}
                {showSearch && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                    {searchResults.map((result) => (
                      <Link
                        key={result.id}
                        href={`/listings/${result.id}`}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowSearch(false)}
                      >
                        {result.images?.[0] ? (
                          <img src={result.images[0]} alt={result.title} className="w-10 h-10 object-cover rounded-lg" />
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <ShoppingBag className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 truncate">{result.title}</p>
                          <p className="text-sm text-yellow-600 font-bold">${result.price}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-4">
              <Link href="/auth/login" className="flex items-center gap-1 text-slate-700 hover:text-yellow-600">
                <User className="w-5 h-5" />
                <span className="hidden sm:inline text-sm">{user ? 'Account' : 'Login'}</span>
              </Link>
              <button className="flex items-center gap-1 text-slate-700 hover:text-yellow-600">
                <Heart className="w-5 h-5" />
              </button>
              <Link href="/marketplace" className="flex items-center gap-1 text-slate-700 hover:text-yellow-600">
                <ShoppingBag className="w-5 h-5" />
              </Link>
              <button 
                className="md:hidden"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mt-4 relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-4 py-2 pl-10 border border-gray-200 rounded-full"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearch(true);
                }}
                onFocus={() => setShowSearch(true)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            {/* Mobile Search Autocomplete */}
            {showSearch && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 max-h-60 overflow-y-auto">
                {searchResults.map((result) => (
                  <Link
                    key={result.id}
                    href={`/listings/${result.id}`}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowSearch(false)}
                  >
                    {result.images?.[0] ? (
                      <img src={result.images[0]} alt={result.title} className="w-10 h-10 object-cover rounded-lg" />
                    ) : (
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 truncate">{result.title}</p>
                      <p className="text-sm text-yellow-600 font-bold">${result.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className={`md:flex items-center gap-6 mt-4 ${menuOpen ? 'flex flex-col' : 'hidden'}`}>
            <Link href="/" className="text-yellow-600 font-medium">Home</Link>
            <Link href="/marketplace" className="text-slate-700 hover:text-yellow-600">Shop</Link>
            <Link href="/marketplace?category=sunglasses" className="text-slate-700 hover:text-yellow-600">Sunglasses</Link>
            <Link href="/marketplace?category=eyeglasses" className="text-slate-700 hover:text-yellow-600">Eyeglasses</Link>
            <Link href="/about" className="text-slate-700 hover:text-yellow-600">About</Link>
            <Link href="/contact" className="text-slate-700 hover:text-yellow-600">Contact</Link>
            <Link href="/listings/new" className="ml-auto bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-full font-medium transition-colors flex items-center gap-1">
              <Plus className="w-4 h-4" />
              Sell Item
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1920')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 py-24 relative">
          <div className="max-w-2xl">
            <span className="inline-block bg-yellow-500 text-white px-4 py-1 rounded-full text-sm font-medium mb-4">
              New Collection 2024
            </span>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Premium Eyewear<br />
              <span className="text-yellow-400">for You</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Discover our exclusive collection of sunglasses and eyeglasses. 
              Quality, style, and protection all in one place.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/marketplace" className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-4 rounded-full font-bold transition-colors flex items-center gap-2">
                Shop Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/about" className="border-2 border-white text-white hover:bg-white hover:text-slate-900 px-8 py-4 rounded-full font-bold transition-colors">
                Learn More
              </Link>
            </div>
          </div>
        </div>
        
        {/* Stats */}
        <div className="bg-slate-800/50 backdrop-blur-sm py-8">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-yellow-400">10K+</div>
              <div className="text-gray-400">Products</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-400">5K+</div>
              <div className="text-gray-400">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-400">50+</div>
              <div className="text-gray-400">Brands</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-400">15+</div>
              <div className="text-gray-400">Cities</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat, index) => (
              <Link 
                key={index}
                href={`/marketplace?category=${cat.slug}`}
                className="group relative overflow-hidden rounded-2xl aspect-square"
              >
                <img 
                  src={cat.image} 
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white font-bold text-xl">{cat.name}</h3>
                  <p className="text-gray-300 text-sm">{cat.count} Products</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Featured Products</h2>
            <Link href="/marketplace" className="text-yellow-600 font-medium flex items-center gap-1 hover:gap-2 transition-all">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow group">
                <div className="relative aspect-square overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                    New
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button className="bg-white text-slate-900 p-3 rounded-full hover:bg-yellow-500 hover:text-white transition-colors">
                      <Eye className="w-5 h-5" />
                    </button>
                    <button className="bg-white text-slate-900 p-3 rounded-full hover:bg-yellow-500 hover:text-white transition-colors">
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-500 text-sm">{product.brand}</p>
                  <h3 className="font-semibold text-slate-900 mb-2">{product.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <span className="text-gray-400 text-sm">({product.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-yellow-600">${product.price}</span>
                    <button className="bg-slate-900 text-white px-4 py-2 rounded-full text-sm hover:bg-yellow-500 transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Listings from Marketplace */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Latest Listings</h2>
            <Link href="/marketplace" className="text-yellow-600 font-medium flex items-center gap-1 hover:gap-2 transition-all">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1,2,3,4].map(i => (
                <div key={i} className="bg-gray-100 rounded-2xl aspect-square animate-pulse"></div>
              ))}
            </div>
          ) : listings.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {listings.map((listing) => (
                <Link 
                  key={listing.id}
                  href={`/listings/${listing.id}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow group"
                >
                  <div className="relative aspect-square overflow-hidden">
                    {listing.images && listing.images[0] ? (
                      <img 
                        src={listing.images[0]} 
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <ShoppingBag className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-900 mb-1 truncate">{listing.title}</h3>
                    <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
                      <MapPin className="w-3 h-3" />
                      {listing.address || 'Tunisia'}
                    </div>
                    <span className="text-xl font-bold text-yellow-600">${listing.price}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No listings yet. Be the first to sell!</p>
              <Link href="/listings/new" className="inline-block mt-4 bg-yellow-500 text-white px-6 py-3 rounded-full font-medium hover:bg-yellow-600">
                Create Listing
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-4 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Choose GAFAS Tunisia?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-slate-800 rounded-2xl">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Premium Quality</h3>
              <p className="text-gray-400">100% authentic products from authorized dealers</p>
            </div>
            <div className="text-center p-8 bg-slate-800 rounded-2xl">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
              <p className="text-gray-400">Same-day delivery in Tunis and surrounding areas</p>
            </div>
            <div className="text-center p-8 bg-slate-800 rounded-2xl">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Expert Support</h3>
              <p className="text-gray-400">Professional eye care consultation available</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 px-4 bg-yellow-500">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-white/80 mb-8">Get the latest updates on new products and upcoming sales</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-full focus:outline-none"
            />
            <button className="bg-slate-900 text-white px-8 py-4 rounded-full font-bold hover:bg-slate-800 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">GAFAS</h3>
                <p className="text-xs text-gray-400">Tunisia</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4">Your trusted destination for premium eyewear in Tunisia.</p>
            <div className="flex gap-4">
              <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-yellow-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-yellow-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-yellow-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/" className="hover:text-yellow-500">Home</Link></li>
              <li><Link href="/marketplace" className="hover:text-yellow-500">Shop</Link></li>
              <li><Link href="/about" className="hover:text-yellow-500">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-yellow-500">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-yellow-500">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-yellow-500">Returns & Exchanges</a></li>
              <li><a href="#" className="hover:text-yellow-500">FAQ</a></li>
              <li><a href="#" className="hover:text-yellow-500">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Tunis, Tunisia
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                +216 00 000 000
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                contact@gafas-tunisia.tn
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 text-center text-gray-400">
          <p>&copy; 2024 GAFAS Tunisia. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
