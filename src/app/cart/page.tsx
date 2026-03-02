'use client';

import Link from 'next/link';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag, Loader2 } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';

export default function CartPage() {
  const cart = useCartStore();

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <ShoppingBag className="w-20 h-20 text-gray-200 mb-6" />
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link href="/marketplace" className="bg-yellow-500 text-white px-8 py-4 rounded-full font-bold hover:bg-yellow-600 transition-colors">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/marketplace" className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-slate-900">Shopping Cart ({cart.getItemCount()})</h1>
          </div>
          <button
            onClick={() => cart.clearCart()}
            className="text-red-500 hover:text-red-600 text-sm"
          >
            Clear Cart
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="divide-y">
            {cart.items.map((item) => (
              <div key={item.listing.id} className="p-6 flex gap-6">
                {/* Image */}
                <div className="w-28 h-28 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                  {item.listing.images?.[0] ? (
                    <img 
                      src={item.listing.images[0]} 
                      alt={item.listing.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="w-10 h-10 text-gray-300" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1">
                  <Link href={`/listings/${item.listing.id}`} className="font-semibold text-slate-900 hover:text-yellow-600">
                    {item.listing.title}
                  </Link>
                  <p className="text-gray-500 text-sm mt-1">
                    Condition: {item.listing.condition || 'N/A'}
                  </p>
                  <p className="text-xl font-bold text-yellow-600 mt-2">
                    ${item.listing.price.toLocaleString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => cart.removeItem(item.listing.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-xl font-bold">${cart.getTotal().toLocaleString()}</span>
          </div>
          <p className="text-gray-500 text-sm mb-6">Shipping and taxes calculated at checkout</p>
          
          <Link
            href="/checkout"
            className="block w-full bg-yellow-500 hover:bg-yellow-600 text-white text-center py-4 rounded-xl font-bold transition-colors"
          >
            Proceed to Checkout
          </Link>
          
          <Link href="/marketplace" className="block text-center mt-4 text-slate-600 hover:text-slate-900">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
