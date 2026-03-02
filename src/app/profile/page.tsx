'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  LogOut, 
  ShoppingBag, 
  Heart, 
  Settings,
  Edit,
  Plus,
  Package,
  Loader2,
  Trash2,
  Eye,
  Star,
  MessageCircle,
  WhatsApp
} from 'lucide-react';
import { supabase, getCurrentUser } from '@/lib/supabase/client';
import { getListingsBySeller, deleteListing } from '@/lib/api/listings';
import type { Profile, Listing } from '@/types';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('listings');

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      router.push('/auth/login');
      return;
    }
    setUser(currentUser);
    
    // Fetch profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', currentUser.id)
      .single();
    
    if (profileData) {
      setProfile(profileData);
    }

    // Fetch user's listings
    const { data: listingsData } = await getListingsBySeller(currentUser.id);
    setListings(listingsData || []);
    
    // Fetch user's orders (as buyer)
    const { data: ordersData } = await supabase
      .from('orders')
      .select('*, order_items(*, listings(*))')
      .eq('buyer_id', currentUser.id)
      .order('created_at', { ascending: false });
    setOrders(ordersData || []);
    
    setIsLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  // Delete a listing
  const handleDeleteListing = async (listingId: string) => {
    if (!confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      return;
    }
    
    try {
      const { success, error } = await deleteListing(listingId);
      if (error) {
        alert('Failed to delete listing: ' + error.message);
        return;
      }
      
      // Remove from local state
      setListings(listings.filter(l => l.id !== listingId));
      alert('Listing deleted successfully!');
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete listing');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              {profile?.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt={profile.full_name || 'Profile'}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white/20"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-yellow-500 flex items-center justify-center border-4 border-white/20">
                  <User className="w-16 h-16 text-white" />
                </div>
              )}
              <button className="absolute bottom-0 right-0 bg-yellow-500 p-2 rounded-full hover:bg-yellow-600 transition-colors">
                <Edit className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Info */}
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-bold">{profile?.full_name || 'Your Name'}</h1>
              <p className="text-gray-300">{profile?.username || '@username'}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4 text-gray-300">
                {profile?.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {profile.phone}
                  </span>
                )}
                {user?.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </span>
                )}
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b">
          <button
            onClick={() => setActiveTab('listings')}
            className={`flex items-center gap-2 px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'listings'
                ? 'border-yellow-500 text-yellow-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            My Listings ({listings.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'orders'
                ? 'border-yellow-500 text-yellow-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Package className="w-5 h-5" />
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex items-center gap-2 px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'favorites'
                ? 'border-yellow-500 text-yellow-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Heart className="w-5 h-5" />
            Favorites
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'settings'
                ? 'border-yellow-500 text-yellow-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Settings className="w-5 h-5" />
            Settings
          </button>
        </div>

        {/* Listings Tab */}
        {activeTab === 'listings' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">My Listings</h2>
              <Link
                href="/listings/new"
                className="flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-medium transition-colors"
              >
                <Plus className="w-5 h-5" />
                New Listing
              </Link>
            </div>

            {listings.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <div key={listing.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                    <div className="aspect-video relative">
                      {listing.images && listing.images[0] ? (
                        <img 
                          src={listing.images[0]} 
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <Package className="w-12 h-12 text-gray-300" />
                        </div>
                      )}
                      {listing.is_sold && (
                        <div className="absolute top-3 left-3 bg-gray-900 text-white px-3 py-1 rounded-full text-sm">
                          Sold
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-slate-900 mb-1">{listing.title}</h3>
                      <p className="text-xl font-bold text-yellow-600">{listing.price} {listing.currency || 'TND'}</p>
                      <div className="flex gap-2 mt-4">
                        <Link
                          href={`/listings/${listing.id}`}
                          className="flex-1 text-center py-2 border border-gray-200 rounded-lg hover:border-yellow-500 hover:text-yellow-600 transition-colors flex items-center justify-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Link>
                        <Link
                          href={`/listings/${listing.id}/edit`}
                          className="flex-1 text-center py-2 border border-gray-200 rounded-lg hover:border-yellow-500 hover:text-yellow-600 transition-colors flex items-center justify-center gap-1"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteListing(listing.id)}
                          className="px-3 py-2 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 hover:border-red-500 transition-colors"
                          title="Delete listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No listings yet</h3>
                <p className="text-gray-500 mb-6">Start selling by creating your first listing</p>
                <Link
                  href="/listings/new"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-medium transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Create Listing
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-semibold text-slate-900">Order #{order.id.slice(0, 8)}</p>
                        <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === 'completed' ? 'bg-green-100 text-green-700' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {order.order_items?.map((item: any) => (
                        <div key={item.id} className="flex items-center gap-4">
                          {item.listings?.images?.[0] ? (
                            <img src={item.listings.images[0]} alt={item.listings.title} className="w-16 h-16 object-cover rounded-lg" />
                          ) : (
                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Package className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="font-medium text-slate-900">{item.listings?.title || 'Product'}</p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity} × ${item.price}</p>
                          </div>
                          <p className="font-bold text-yellow-600">${item.quantity * item.price}</p>
                        </div>
                      ))}
                    </div>
                    <div className="border-t mt-4 pt-4 flex justify-between items-center">
                      <p className="text-gray-500">Total</p>
                      <p className="text-xl font-bold text-slate-900">${order.total_amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No orders yet</h3>
                <p className="text-gray-500 mb-6">When you purchase items, they will appear here</p>
                <Link
                  href="/marketplace"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-medium transition-colors"
                >
                  Start Shopping
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Favorites Tab */}
        {activeTab === 'favorites' && (
          <div className="text-center py-16 bg-white rounded-2xl">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No favorites yet</h3>
            <p className="text-gray-500">Save items you love to find them easily later</p>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Account Settings</h2>
            
            <form className="space-y-6 max-w-xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  defaultValue={profile?.full_name || ''}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  defaultValue={profile?.username || ''}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  defaultValue={profile?.phone || ''}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  rows={4}
                  defaultValue={profile?.bio || ''}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500 resize-none"
                  placeholder="Tell us about yourself..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-medium transition-colors"
              >
                Save Changes
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
