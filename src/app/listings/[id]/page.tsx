'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  MapPin, 
  Clock, 
  Eye, 
  MessageCircle,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Star,
  User,
  Shield,
  Truck,
  RotateCcw,
  Loader2
} from 'lucide-react';
import { supabase, getCurrentUser } from '@/lib/supabase/client';
import { getListingById, incrementViewCount } from '@/lib/api/listings';
import type { ListingWithSeller } from '@/types';

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<ListingWithSeller | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const init = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      
      if (params.id) {
        const { data } = await getListingById(params.id as string);
        setListing(data);
        
        if (data) {
          await incrementViewCount(data.id);
          fetchReviews(data.id);
        }
      }
      setIsLoading(false);
    };
    init();
  }, [params.id]);

  const handleSendMessage = async () => {
    if (!message.trim() || !user) return;
    setSending(true);
    
    // Create message in database
    const { error } = await supabase.from('messages').insert({
      sender_id: user.id,
      listing_id: listing?.id,
      content: message,
    });
    
    if (!error) {
      setShowContactForm(false);
      setMessage('');
      alert('Message sent to seller!');
    }
    setSending(false);
  };

  const handleBuyNow = () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    // Add to cart and go to checkout
    router.push('/checkout?listing=' + listing?.id);
  };

  // Fetch reviews for this listing
  const fetchReviews = async (listingId: string) => {
    const { data } = await supabase
      .from('reviews')
      .select('*, profiles(full_name, avatar_url)')
      .eq('listing_id', listingId)
      .order('created_at', { ascending: false });
    setReviews(data || []);
  };

  // Submit a review
  const handleSubmitReview = async () => {
    if (!user || !reviewText.trim()) return;
    setSubmittingReview(true);
    
    const { error } = await supabase.from('reviews').insert({
      listing_id: listing?.id,
      reviewer_id: user.id,
      rating: reviewRating,
      comment: reviewText.trim(),
    });
    
    if (!error) {
      setReviewText('');
      setReviewRating(5);
      setShowReviewForm(false);
      if (listing) fetchReviews(listing.id);
    }
    setSubmittingReview(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Listing Not Found</h1>
        <Link href="/marketplace" className="text-yellow-600 hover:underline">
          Back to Marketplace
        </Link>
      </div>
    );
  }

  const images = listing.images || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-2 rounded-full ${isFavorite ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-500'} hover:bg-gray-200`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-sm">
              {images.length > 0 ? (
                <img 
                  src={images[selectedImage]} 
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <ShoppingBag className="w-24 h-24 text-gray-300" />
                </div>
              )}
              
              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button 
                    onClick={() => setSelectedImage((prev) => (prev - 1 + images.length) % images.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setSelectedImage((prev) => (prev + 1) % images.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
              
              {listing.condition && (
                <span className="absolute top-4 left-4 bg-slate-900/80 text-white px-3 py-1 rounded-full text-sm capitalize">
                  {listing.condition}
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                      i === selectedImage ? 'border-yellow-500' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Title & Price */}
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs capitalize">
                  {listing.condition}
                </span>
                <span>•</span>
                <span>{listing.view_count} views</span>
              </div>
              <h1 className="text-3xl font-bold text-slate-900">{listing.title}</h1>
              <div className="flex items-baseline gap-2 mt-4">
                <span className="text-4xl font-bold text-yellow-600">${listing.price.toLocaleString()}</span>
                <span className="text-gray-500">{listing.currency}</span>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-5 h-5" />
              <span>{listing.address || 'Location not specified'}</span>
            </div>

            {/* Posted Time */}
            <div className="flex items-center gap-2 text-gray-500">
              <Clock className="w-5 h-5" />
              <span>Posted {new Date(listing.created_at).toLocaleDateString()}</span>
            </div>

            {/* Description */}
            {listing.description && (
              <div className="border-t pt-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-3">Description</h2>
                <p className="text-gray-600 whitespace-pre-wrap">{listing.description}</p>
              </div>
            )}

            {/* Seller Info */}
            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Seller</h2>
              <div className="flex items-center gap-4">
                {listing.seller_avatar ? (
                  <img 
                    src={listing.seller_avatar} 
                    alt={listing.seller_full_name || 'Seller'}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-yellow-100 flex items-center justify-center">
                    <User className="w-7 h-7 text-yellow-600" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">
                    {listing.seller_full_name || listing.seller_username || 'Unknown Seller'}
                  </h3>
                  <p className="text-sm text-gray-500">Member since 2024</p>
                </div>
                {user?.id !== listing.seller_id && (
                  <button 
                    onClick={() => setShowContactForm(true)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:border-yellow-500 hover:text-yellow-600"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Contact
                  </button>
                )}
              </div>
            </div>

            {/* Contact Form */}
            {showContactForm && (
              <div className="bg-gray-50 rounded-xl p-4 border">
                <h3 className="font-semibold mb-3">Send Message to Seller</h3>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Hi, I'm interested in this item..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-yellow-500 mb-3"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSendMessage}
                    disabled={sending || !message.trim()}
                    className="flex-1 bg-yellow-500 text-white py-2 rounded-lg font-medium hover:bg-yellow-600 disabled:opacity-50"
                  >
                    {sending ? 'Sending...' : 'Send Message'}
                  </button>
                  <button
                    onClick={() => setShowContactForm(false)}
                    className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleBuyNow}
                disabled={listing.is_sold}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-4 rounded-xl font-bold text-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                {listing.is_sold ? 'Sold Out' : 'Buy Now'}
              </button>
              {user?.id !== listing.seller_id && (
                <button 
                  onClick={() => setShowContactForm(true)}
                  className="px-6 py-4 border-2 border-slate-900 rounded-xl font-bold hover:bg-slate-900 hover:text-white transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Secure Payment</p>
              </div>
              <div className="text-center">
                <Truck className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Fast Delivery</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Easy Returns</p>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="border-t pt-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  Reviews ({reviews.length})
                </h2>
                {user && user.id !== listing?.seller_id && (
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="text-yellow-600 font-medium hover:underline"
                  >
                    {showReviewForm ? 'Cancel' : 'Write a Review'}
                  </button>
                )}
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <div className="bg-gray-50 rounded-xl p-4 border mb-4">
                  <h3 className="font-semibold mb-3">Your Review</h3>
                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="p-1"
                      >
                        <Star 
                          className={`w-6 h-6 ${star <= reviewRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                        />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your experience with this product..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-yellow-500 mb-3"
                  />
                  <button
                    onClick={handleSubmitReview}
                    disabled={submittingReview || !reviewText.trim()}
                    className="bg-yellow-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-yellow-600 disabled:opacity-50"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              )}

              {/* Reviews List */}
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-0">
                      <div className="flex items-start gap-3">
                        {review.profiles?.avatar_url ? (
                          <img 
                            src={review.profiles.avatar_url} 
                            alt={review.profiles.full_name || 'User'}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                            <User className="w-5 h-5 text-yellow-600" />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-slate-900">
                              {review.profiles?.full_name || 'Anonymous'}
                            </span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm">{review.comment}</p>
                          <p className="text-gray-400 text-xs mt-2">
                            {new Date(review.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Star className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No reviews yet. Be the first to review this product!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
