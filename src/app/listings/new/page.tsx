'use client';

import { Suspense } from 'react';
import ListingForm from '@/components/listings/ListingForm';
import { Package } from 'lucide-react';

function ListingFormContent() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Vendre un article</h1>
        <p className="text-gray-600 mt-2">
          Créez votre annonce en quelques minutes. Tout le monde en Tunisie peut voir votre article!
        </p>
      </div>
      
      <ListingForm />
    </div>
  );
}

export default function NewListingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Suspense fallback={
          <div className="flex items-center justify-center py-20">
            <Package className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        }>
          <ListingFormContent />
        </Suspense>
      </div>
    </div>
  );
}
