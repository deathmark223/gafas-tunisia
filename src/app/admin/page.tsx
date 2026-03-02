'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Package, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Loader2
} from 'lucide-react';
import { supabase, getCurrentUser } from '@/lib/supabase/client';

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalListings: 0,
    activeListings: 0,
    totalOrders: 0,
  });
  const [listings, setListings] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const init = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        // For demo, just continue - in production, check admin role
      }
      setUser(currentUser);
      
      // Fetch stats
      const [usersRes, listingsRes, ordersRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('listings').select('*'),
        supabase.from('orders').select('*'),
      ]);

      setStats({
        totalUsers: usersRes.count || 0,
        totalListings: listingsRes.data?.length || 0,
        activeListings: listingsRes.data?.filter(l => l.is_active && !l.is_sold).length || 0,
        totalOrders: ordersRes.data?.length || 0,
      });

      setListings(listingsRes.data || []);
      setOrders(ordersRes.data || []);
      setIsLoading(false);
    };
    init();
  }, []);

  const handleDeleteListing = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    await supabase.from('listings').delete().eq('id', id);
    setListings(listings.filter(l => l.id !== id));
  };

  const handleToggleListing = async (id: string, isActive: boolean) => {
    await supabase.from('listings').update({ is_active: !isActive }).eq('id', id);
    setListings(listings.map(l => l.id === id ? { ...l, is_active: !isActive } : l));
  };

  const handleUpdateOrderStatus = async (id: string, status: string) => {
    await supabase.from('orders').update({ status }).eq('id', id);
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
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
      <div className="bg-slate-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-400 mt-2">Manage your marketplace</p>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 -mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
                <p className="text-gray-500 text-sm">Total Users</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.activeListings}</p>
                <p className="text-gray-500 text-sm">Active Listings</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalOrders}</p>
                <p className="text-gray-500 text-sm">Total Orders</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  ${orders.reduce((sum, o) => sum + (o.total || 0), 0).toLocaleString()}
                </p>
                <p className="text-gray-500 text-sm">Total Revenue</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="flex gap-4 border-b mb-6">
          {['overview', 'listings', 'orders'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-medium capitalize border-b-2 transition-colors ${
                activeTab === tab 
                  ? 'border-yellow-500 text-yellow-600' 
                  : 'border-transparent text-gray-500'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-4">Recent Orders</h3>
              <div className="space-y-3">
                {orders.slice(0, 5).map(order => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">#{order.id.slice(0, 8)}</p>
                      <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${order.total}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        order.status === 'paid' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Listings */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-4">Recent Listings</h3>
              <div className="space-y-3">
                {listings.slice(0, 5).map(listing => (
                  <div key={listing.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg overflow-hidden">
                        {listing.images?.[0] && (
                          <img src={listing.images[0]} alt="" className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium truncate max-w-[150px]">{listing.title}</p>
                        <p className="text-sm text-gray-500">${listing.price}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      listing.is_sold ? 'bg-red-100 text-red-700' :
                      listing.is_active ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {listing.is_sold ? 'Sold' : listing.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Listings Management */}
        {activeTab === 'listings' && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search listings..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 font-medium">Listing</th>
                  <th className="text-left p-4 font-medium">Price</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Views</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {listings.map(listing => (
                  <tr key={listing.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                          {listing.images?.[0] && (
                            <img src={listing.images[0]} alt="" className="w-full h-full object-cover" />
                          )}
                        </div>
                        <span className="font-medium">{listing.title}</span>
                      </div>
                    </td>
                    <td className="p-4 font-bold">${listing.price}</td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        listing.is_sold ? 'bg-red-100 text-red-700' :
                        listing.is_active ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {listing.is_sold ? 'Sold' : listing.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500">{listing.view_count}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleListing(listing.id, listing.is_active)}
                          className="p-2 text-gray-500 hover:text-yellow-600"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteListing(listing.id)}
                          className="p-2 text-gray-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Orders Management */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 font-medium">Order ID</th>
                  <th className="text-left p-4 font-medium">Customer</th>
                  <th className="text-left p-4 font-medium">Total</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Date</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="p-4 font-mono text-sm">#{order.id.slice(0, 8)}</td>
                    <td className="p-4">{order.shipping_address?.split(',')[0] || 'N/A'}</td>
                    <td className="p-4 font-bold">${order.total}</td>
                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                        className="text-xs px-2 py-1 rounded-full border-0 bg-gray-100"
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-4 text-gray-500 text-sm">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <button className="p-2 text-gray-500 hover:text-yellow-600">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
