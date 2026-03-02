'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ShoppingBag, 
  Star,
  Loader2,
  Calendar,
  Package,
  MessageCircle,
  WhatsApp
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import type { Profile, Listing } from '@/types';

export default function SellerProfilePage() {
  const params = useParams();
  const [seller, setSeller] = useState<Profile | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSellerProfile();
  }, [params.id]);

  const fetchSellerProfile = async () => {
    try {
      setIsLoading(true);
      
      // Fetch seller profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', params.id)
        .single();

      if (profileError || !profile) {
        setError('Seller not found');
        setIsLoading(false);
        return;
      }

      setSeller(profile);

      // Fetch seller's active listings
      const { data: listingsData, error: listingsError } = await supabase
        .from('listings')
        .select('*')
        .eq('seller_id', params.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (!listingsError) {
        setListings(listingsData || []);
      }
    } catch (err) {
      console.error('Error fetching seller:', err);
      setError('Failed to load seller profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  if (error || !seller) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">{error || 'Seller Not Found'}</h1>
        <Link href="/marketplace" className="text-yellow-600 hover:underline">
          Back to Marketplace
        </Link>
      </div>
    );
  }

  const memberSince = seller.created_at ? new Date(seller.created_at).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long' 
  }) : 'Unknown';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Seller Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="relative">
              {seller.avatar_url ? (
                <img 
                  src={seller.avatar_url} 
                  alt={seller.full_name || 'Seller'}
                  className="w-40 h-40 rounded-full object-cover border-4 border-white/20 shadow-xl"
                />
              ) : (
                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center border-4 border-white/20 shadow-xl">
                  <User className="w-20 h-20 text-white" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="text-center md:text-left flex-1">
              <h1 className="text-4xl font-bold mb-2">
                {seller.full_name || 'Seller'}
              </h1>
              {seller.username && (
                <p className="text-xl text-gray-300 mb-4">@{seller.username}</p>
              )}
              
              {/* Stats */}
              <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-4">
                <div className="flex items-center gap-2 text-gray-300">
                  <ShoppingBag className="w-5 h-5" />
                  <span className="font-medium">{listings.length} listings</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Calendar className="w-5 h-5" />
                  <span>Member since {memberSince}</span>
                </div>
              </div>

              {/* Contact Options */}
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-6">
                {seller.phone && (
                  <>
                    <a
                      href={`https://wa.me/${seller.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      WhatsApp
                    </a>
                    <a
                      href={`tel:${seller.phone}`}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-medium transition-colors"
                    >
                      <Phone className="w-5 h-5" />
                      {seller.phone}
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Bio Section */}
        {seller.bio && (
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-3">About</h2>
            <p className="text-gray-600">{seller.bio}</p>
          </div>
        )}

        {/* Listings Section */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Listings by {seller.full_name || 'this seller'}
          </h2>

          {listings.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {listings.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/listings/${listing.id}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
                >
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
                      <div className="absolute top-3 left-3 bg-gray-900 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Sold
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-900 mb-1 line-clamp-1">{listing.title}</h3>
                    <p className="text-xl font-bold text-yellow-600">
                      {listing.price} {listing.currency || 'TND'}
                    </p>
                    {listing.address && (
                      <div className="flex items-center gap-1 text-sm text-gray-500 mt-2">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{listing.address}</span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No listings yet</h3>
              <p className="text-gray-500">This seller hasn't posted any items for sale.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
