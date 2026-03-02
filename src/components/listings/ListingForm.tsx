'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Upload, 
  X, 
  MapPin, 
  Loader2, 
  Image as ImageIcon,
  DollarSign,
  Tag,
  FileText,
  Package
} from 'lucide-react';
import { supabase, getCurrentUser } from '@/lib/supabase/client';
import { createListing } from '@/lib/api/listings';
import { getCategories } from '@/lib/api/categories';
import type { ListingCondition, Category, GeoPoint } from '@/types';

interface ListingFormProps {
  userId?: string;
  onSuccess?: () => void;
}

const CONDITIONS: { value: ListingCondition; label: string; description: string }[] = [
  { value: 'new', label: 'New', description: 'Brand new, never used' },
  { value: 'like-new', label: 'Like New', description: 'Used once or twice' },
  { value: 'good', label: 'Good', description: 'Minor wear, works perfectly' },
  { value: 'fair', label: 'Fair', description: 'Visible wear, still works' },
  { value: 'poor', label: 'Poor', description: 'May need repairs' },
];

export default function ListingForm({ userId, onSuccess }: ListingFormProps) {
  const router = useRouter();
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('TND');
  const [condition, setCondition] = useState<ListingCondition>('good');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState<GeoPoint | null>(null);
  
  // UI state
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  // Fetch categories on mount
  useState(() => {
    const fetchCategories = async () => {
      const { data } = await getCategories();
      setCategories(data);
    };
    fetchCategories();
  });

  // Handle image selection
  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 10) {
      setError('Maximum 10 images allowed');
      return;
    }

    // Create previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
    setImages(prev => [...prev, ...files]);
  }, [images]);

  // Remove image
  const removeImage = useCallback((index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Validate
      if (!title.trim()) {
        throw new Error('Title is required');
      }
      if (!price || parseFloat(price) <= 0) {
        throw new Error('Valid price is required');
      }
      if (images.length === 0) {
        throw new Error('At least one image is required');
      }

      // Get current user if not provided
      let sellerId = userId;
      if (!sellerId) {
        const user = await getCurrentUser();
        if (!user) {
          router.push('/auth/login?redirect=/listings/new');
          return;
        }
        sellerId = user.id;
      }

      // Create listing
      const { data: listing, error: createError } = await createListing(
        {
          seller_id: sellerId,
          title: title.trim(),
          description: description.trim() || undefined,
          price: parseFloat(price),
          currency,
          condition,
          category_id: categoryId || undefined,
          location: location ? `POINT(${location.lng} ${location.lat})` : undefined,
          address: address.trim() || undefined,
        },
        images
      );

      if (createError) {
        throw createError;
      }

      // Success
      if (onSuccess) {
        onSuccess();
      } else {
        router.push(`/listings/${listing?.id}`);
      }
    } catch (err) {
      console.error('Error creating listing:', err);
      setError(err instanceof Error ? err.message : 'Failed to create listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open location picker - Default to Gafsa, Tunisia
  const handleOpenLocationPicker = () => {
    // Default to Gafsa, Tunisia coordinates
    const gafsaCoords = { lat: 34.4251, lng: 9.4697 };
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setAddress('Current Location');
        },
        (err) => {
          console.error('Geolocation error:', err);
          // Fall back to Gafsa, Tunisia
          setLocation(gafsaCoords);
          setAddress('Gafsa, Tunisia');
        }
      );
    } else {
      // Fall back to Gafsa, Tunisia
      setLocation(gafsaCoords);
      setAddress('Gafsa, Tunisia');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Image Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Photos <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {imagePreviews.map((preview, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          {images.length < 10 && (
            <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 flex flex-col items-center justify-center cursor-pointer transition-colors">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                className="hidden"
              />
              <ImageIcon className="w-8 h-8 text-gray-400" />
              <span className="text-xs text-gray-500 mt-1">Add Photo</span>
            </label>
          )}
        </div>
        <p className="text-sm text-gray-500">
          Add up to 10 photos. First photo will be the cover.
        </p>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What are you selling?"
            maxLength={100}
            required
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Price */}
      <div className="space-y-2">
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          Price <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            min="0"
            step="0.01"
            required
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-100 border-0 rounded py-1 px-2 text-sm"
          >
            <option value="TND">TND (د.ت)</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="category"
          value={categoryId || ''}
          onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : null)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.parent_id ? '— ' : ''}{cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Condition */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Condition <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {CONDITIONS.map((cond) => (
            <button
              key={cond.value}
              type="button"
              onClick={() => setCondition(cond.value)}
              className={`p-3 rounded-lg border text-left transition-all ${
                condition === cond.value
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium text-sm">{cond.label}</div>
              <div className="text-xs text-gray-500">{cond.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <div className="relative">
          <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your item..."
            rows={4}
            maxLength={2000}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Location
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Gafsa, Tunisia - Enter your address"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="button"
            onClick={handleOpenLocationPicker}
            className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2 transition-colors"
          >
            <MapPin className="w-5 h-5" />
            <span className="hidden sm:inline">Use GPS</span>
          </button>
        </div>
        {location && (
          <p className="text-sm text-green-600">
            ✓ Location set: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
          </p>
        )}
      </div>

      {/* Submit */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Creating Listing...
            </>
          ) : (
            <>
              <Package className="w-5 h-5" />
              Create Listing
            </>
          )}
        </button>
      </div>
    </form>
  );
}
