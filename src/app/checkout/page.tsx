'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  CreditCard, 
  Truck, 
  MapPin, 
  Phone, 
  User,
  ShoppingBag,
  Loader2,
  Check
} from 'lucide-react';
import { supabase, getCurrentUser } from '@/lib/supabase/client';
import { useCartStore } from '@/lib/store/cart';
import { getListingById } from '@/lib/api/listings';
import type { Listing } from '@/types';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cart = useCartStore();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    notes: '',
  });

  useEffect(() => {
    const init = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.push('/auth/login?redirect=/checkout');
        return;
      }
      setUser(currentUser);
      
      // Get listing from URL if buying single item
      const listingId = searchParams.get('listing');
      if (listingId) {
        const { data } = await getListingById(listingId);
        if (data) {
          cart.addItem(data as unknown as Listing);
        }
      }
      
      // Pre-fill user data
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();
      
      if (profile) {
        setFormData({
          firstName: profile.full_name?.split(' ')[0] || '',
          lastName: profile.full_name?.split(' ').slice(1).join(' ') || '',
          email: currentUser.email || '',
          phone: profile.phone || '',
          address: '',
          city: '',
          postalCode: '',
          notes: '',
        });
      }
      
      setIsLoading(false);
    };
    init();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      // Create order
      const { data: order, error } = await supabase.from('orders').insert({
        buyer_id: user.id,
        total: cart.getTotal(),
        status: 'pending',
        shipping_address: `${formData.firstName} ${formData.lastName}, ${formData.address}, ${formData.city} ${formData.postalCode}`,
        phone: formData.phone,
        notes: formData.notes,
      }).select().single();

      if (error) throw error;

      // Create order items
      for (const item of cart.items) {
        await supabase.from('order_items').insert({
          order_id: order.id,
          listing_id: item.listing.id,
          price: item.listing.price,
          quantity: item.quantity,
        });

        // Mark listing as sold
        await supabase.from('listings').update({ is_sold: true }).eq('id', item.listing.id);
      }

      // Clear cart
      cart.clearCart();
      
      setOrderId(order.id);
      setOrderComplete(true);
    } catch (err) {
      console.error('Order error:', err);
      alert('Failed to process order. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Order Confirmed!</h1>
          <p className="text-gray-600 mb-2">Thank you for your purchase.</p>
          <p className="text-gray-500 mb-8">Order ID: #{orderId.slice(0, 8)}</p>
          <div className="flex flex-col gap-3">
            <Link href="/profile" className="bg-yellow-500 text-white py-3 rounded-xl font-medium hover:bg-yellow-600">
              View Order
            </Link>
            <Link href="/marketplace" className="text-yellow-600 font-medium hover:underline">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add some items to checkout</p>
        <Link href="/marketplace" className="bg-yellow-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-yellow-600">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <Link href="/marketplace" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8">
          <ArrowLeft className="w-5 h-5" />
          Continue Shopping
        </Link>

        <h1 className="text-3xl font-bold text-slate-900 mb-8">Checkout</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Shipping Information</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500 resize-none"
                ></textarea>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cart.items.map((item) => (
                  <div key={item.listing.id} className="flex gap-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.listing.images?.[0] ? (
                        <img src={item.listing.images[0]} alt={item.listing.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-8 h-8 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-900">{item.listing.title}</h3>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-slate-900">${(item.listing.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${cart.getTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-slate-900 pt-2 border-t">
                  <span>Total</span>
                  <span className="text-yellow-600">${cart.getTotal().toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={processing}
                className="w-full mt-6 bg-yellow-500 hover:bg-yellow-600 text-white py-4 rounded-xl font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Place Order
                  </>
                )}
              </button>
            </div>

            {/* Trust */}
            <div className="bg-gray-100 rounded-2xl p-6">
              <div className="flex items-center gap-3 text-gray-600">
                <Truck className="w-5 h-5" />
                <span className="text-sm">Free shipping on orders over $100</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
