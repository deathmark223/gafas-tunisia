'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  ArrowRight,
  Plus,
  LogIn,
  Truck,
  Shield,
  CreditCard,
  Headphones,
  Package,
  Tag,
  Zap,
  TrendingUp,
  Clock,
  MessageCircle,
  Send,
  Home,
  Car,
  Laptop,
  Shirt,
  Baby,
  Dumbbell,
  Briefcase,
  Sofa,
  Gem,
  Watch
} from 'lucide-react';
import { supabase, getCurrentUser } from '@/lib/supabase/client';
import { getListings } from '@/lib/api/listings';
import type { ListingWithSeller } from '@/types';

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearch(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    setListings(data.slice(0, 12));
    setIsLoading(false);
  };

  // Tunisia-themed categories
  const categories = [
    { name: 'Electronics', slug: 'electronics-phones', icon: Laptop, color: 'bg-blue-500', count: 1250 },
    { name: 'Vehicles', slug: 'vehicles', icon: Car, color: 'bg-green-500', count: 890 },
    { name: 'Real Estate', slug: 'real-estate', icon: Home, color: 'bg-amber-500', count: 567 },
    { name: 'Fashion', slug: 'fashion-clothing', icon: Shirt, color: 'bg-pink-500', count: 2340 },
    { name: 'Home & Furniture', slug: 'home-furniture', icon: Sofa, color: 'bg-brown-500', count: 780 },
    { name: 'Sports', slug: 'sports-leisure', icon: Dumbbell, color: 'bg-purple-500', count: 450 },
    { name: 'Jobs', slug: 'jobs', icon: Briefcase, color: 'bg-indigo-500', count: 320 },
    { name: 'Beauty', slug: 'beauty', icon: Gem, color: 'bg-rose-500', count: 670 },
    { name: 'Baby & Kids', slug: 'baby-kids', icon: Baby, color: 'bg-yellow-500', count: 410 },
    { name: 'Watches', slug: 'watches-jewelry', icon: Watch, color: 'bg-cyan-500', count: 290 },
  ];

  // Featured deals
  const deals = [
    { id: 1, title: 'Smartphone Samsung', price: 599, oldPrice: 799, discount: 25, location: 'Tunis' },
    { id: 2, title: 'Toyota Corolla 2020', price: 24000, oldPrice: 28000, discount: 14, location: 'Sfax' },
    { id: 3, title: 'Apartment S+2', price: 85000, oldPrice: 95000, discount: 11, location: 'Gafsa' },
    { id: 4, title: 'MacBook Pro M1', price: 1899, oldPrice: 2200, discount: 14, location: 'Tunis' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Banner - Tunisia Flag Colors */}
      <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white py-2 text-center text-sm font-medium animate-pulse">
        <span>🇹🇳 Bienvenue sur HanoutTN - Le plus grand marketplace de Tunisie !</span>
      </div>

      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">H</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-2xl font-bold text-gray-900">Hanout<span className="text-red-600">TN</span></span>
                <p className="text-xs text-gray-500 -mt-1">Marketplace Tunisia</p>
              </div>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl relative" ref={searchRef}>
              <div className="flex">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSearch(true);
                    }}
                    onFocus={() => setShowSearch(true)}
                    placeholder="Rechercher un produit, voiture, appartement..."
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-l-xl focus:border-red-500 focus:outline-none transition-colors"
                  />
                </div>
                <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-r-xl font-semibold transition-colors">
                  Rechercher
                </button>
              </div>
              
              {/* Search Results Dropdown */}
              {showSearch && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border overflow-hidden z-50">
                  {searchResults.map((result) => (
                    <Link
                      key={result.id}
                      href={`/listings/${result.id}`}
                      onClick={() => setShowSearch(false)}
                      className="flex items-center gap-3 p-3 hover:bg-red-50 transition-colors border-b"
                    >
                      {result.images?.[0] && (
                        <img src={result.images[0]} alt={result.title} className="w-12 h-12 object-cover rounded" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{result.title}</p>
                        <p className="text-sm text-red-600 font-bold">{result.price} {result.currency}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <ShoppingBag className="w-6 h-6 text-gray-700" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">0</span>
              </Link>
              
              {user ? (
                <Link href="/profile" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-red-600" />
                  </div>
                </Link>
              ) : (
                <Link href="/auth/login" className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors">
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Connexion</span>
                </Link>
              )}
              
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-xl"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className={`md:flex items-center gap-4 mt-4 pt-4 border-t ${mobileMenuOpen ? 'flex flex-col' : 'hidden'}`}>
            <Link href="/" className="text-red-600 font-semibold">Accueil</Link>
            <Link href="/marketplace" className="text-gray-700 hover:text-red-600 font-medium">Tous les produits</Link>
            <Link href="/marketplace?category=vehicles" className="text-gray-700 hover:text-red-600 font-medium">Voitures</Link>
            <Link href="/marketplace?category=real-estate" className="text-gray-700 hover:text-red-600 font-medium">Immobilier</Link>
            <Link href="/marketplace?category=electronics-phones" className="text-gray-700 hover:text-red-600 font-medium">Electronique</Link>
            <Link href="/marketplace?category=fashion-clothing" className="text-gray-700 hover:text-red-600 font-medium">Mode</Link>
            
            <Link href="/listings/new" className="ml-auto bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-5 py-2 rounded-full font-semibold transition-all shadow-lg flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Vendre
            </Link>
          </nav>
        </div>
      </header>

      {/* Categories Banner */}
      <div className="bg-white shadow-md py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <span className="text-gray-500 text-sm whitespace-nowrap">Catégories:</span>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/marketplace?category=${cat.slug}`}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-red-50 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
              >
                <cat.icon className="w-4 h-4 text-red-600" />
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-red-800/90 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 py-20 relative">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-1 rounded-full text-sm mb-4">
              <Zap className="w-4 h-4" />
              <span>Le #1 Marketplace en Tunisie</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fade-in">
              Achetez et Vendez <br/>
              <span className="text-yellow-300">en Toute Confiance</span>
            </h1>
            <p className="text-xl text-red-100 mb-8">
              Des milliers de produits, véhicules et immobilier en Tunisie. 
              Trouvez ce que vous cherchez près de chez vous à Gafsa et dans toute la Tunisie !
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/marketplace" className="bg-white text-red-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Explorer
              </Link>
              <Link href="/listings/new" className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all">
                Vendre un article
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <div className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center">
                <Shield className="w-7 h-7" />
              </div>
              <div>
                <p className="font-bold">Paiement Sécurisé</p>
                <p className="text-sm text-gray-400">100% sécurisé</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center">
                <Truck className="w-7 h-7" />
              </div>
              <div>
                <p className="font-bold">Livraison</p>
                <p className="text-sm text-gray-400">Partout en Tunisie </div>
            </div>
           </p>
              <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center">
                <Headphones className="w-7 h-7" />
              </div>
              <div>
                <p className="font-bold">Support 24/7</p>
                <p className="text-sm text-gray-400">Always here to help</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center">
                <CreditCard className="w-7 h-7" />
              </div>
              <div>
                <p className="font-bold">Multi-paiement</p>
                <p className="text-sm text-gray-400">Cartes, D17, Payme</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deals Section */}
      <section className="py-12 bg-gradient-to-b from-red-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center animate-pulse">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Bon Plans</h2>
                <p className="text-gray-500">Les meilleures offres du moment</p>
              </div>
            </div>
            <Link href="/marketplace?sort=price_asc" className="flex items-center gap-2 text-red-600 font-semibold hover:underline">
              Voir tout <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {deals.map((deal) => (
              <Link 
                key={deal.id} 
                href={`/listings/${deal.id}`}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 overflow-hidden group"
              >
                <div className="relative h-40 bg-gray-200 overflow-hidden">
                  <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
                    -{deal.discount}%
                  </div>
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <Tag className="w-12 h-12 text-gray-300" />
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-semibold text-gray-900 mb-1 line-clamp-1">{deal.title}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <MapPin className="w-3 h-3" />
                    {deal.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-red-600">{deal.price.toLocaleString()} DT</span>
                    <span className="text-sm text-gray-400 line-through">{deal.oldPrice.toLocaleString()} DT</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Catégories Populaires</h2>
            <p className="text-gray-500 mt-2">Parcourez par catégorie</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((cat, index) => (
              <Link
                key={cat.slug}
                href={`/marketplace?category=${cat.slug}`}
                className="group p-6 bg-gray-50 rounded-2xl hover:bg-red-50 transition-all transform hover:-translate-y-1 hover:shadow-lg"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-14 h-14 ${cat.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <cat.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{cat.name}</h3>
                <p className="text-sm text-gray-500">{cat.count.toLocaleString()} annonces</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Nouveautés</h2>
                <p className="text-gray-500">Les dernières annonces</p>
              </div>
            </div>
            <Link href="/marketplace" className="flex items-center gap-2 text-red-600 font-semibold hover:underline">
              Voir tout <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl h-72 animate-pulse"></div>
              ))}
            </div>
          ) : listings.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {listings.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/listings/${listing.id}`}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 overflow-hidden group"
                >
                  <div className="relative h-40 bg-gray-200 overflow-hidden">
                    {listing.images?.[0] ? (
                      <img 
                        src={listing.images[0]} 
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <Package className="w-10 h-10 text-gray-300" />
                      </div>
                    )}
                    {listing.is_sold && (
                      <div className="absolute top-2 left-2 bg-gray-600 text-white px-2 py-1 rounded text-xs font-bold">Vendu</div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">{listing.title}</h3>
                    <p className="text-lg font-bold text-red-600">{listing.price} {listing.currency}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <MapPin className="w-3 h-3" />
                      {listing.address || 'Tunisie'}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Aucun produit pour le moment</p>
              <Link href="/listings/new" className="inline-block mt-4 bg-red-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-red-700">
                Soyez le premier à vendre !
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Commencez à vendre sur HanoutTN</h2>
          <p className="text-xl text-red-100 mb-8">
            Rejoignez des milliers de vendeurs en Tunisie. C'est gratuit et facile !
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/listings/new" className="bg-white text-red-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-lg">
              Créer une annonce
            </Link>
            <Link href="/auth/signup" className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all">
              Créer un compte
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">HanoutTN</h3>
              <p className="text-sm">Le plus grand marketplace en Tunisie. Achetez et vendez facilement.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/marketplace?category=electronics-phones" className="hover:text-white">Electronique</Link></li>
                <li><Link href="/marketplace?category=vehicles" className="hover:text-white">Voitures</Link></li>
                <li><Link href="/marketplace?category=real-estate" className="hover:text-white">Immobilier</Link></li>
                <li><Link href="/marketplace?category=fashion-clothing" className="hover:text-white">Mode</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Aide</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/about" className="hover:text-white">A propos</Link></li>
                <li><Link href="#" className="hover:text-white">FAQ</Link></li>
                <li><Link href="#" className="hover:text-white">Conditions</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-sm">
                <p>📍 Gafsa, Tunisie</p>
                <p>📧 contact@hanouttn.tn</p>
                <p>📞 +216 12 345 678</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p>© 2024 HanoutTN. Tous droits réservés. 🇹🇳</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
