'use client';

import Link from 'next/link';
import { Star, Award, Users, Globe, Eye, Heart, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  const team = [
    { name: 'Ahmed Ben Ali', role: 'Founder & CEO', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300' },
    { name: 'Sarah Mohamed', role: 'Head of Operations', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300' },
    { name: 'Mohamed Khelifi', role: 'Lead Optometrist', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300' },
    { name: 'Leila Trabelsi', role: 'Marketing Director', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300' },
  ];

  const values = [
    { icon: Eye, title: 'Vision', description: 'We see a world where everyone has access to quality eyewear' },
    { icon: Heart, title: 'Passion', description: 'We love what we do and it shows in our service' },
    { icon: Award, title: 'Excellence', description: 'We strive for perfection in everything we do' },
    { icon: Users, title: 'Community', description: 'We build lasting relationships with our customers' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">About GAFAS Tunisia</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Your trusted destination for premium eyewear in Tunisia
          </p>
        </div>
      </header>

      {/* Story */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Story</h2>
            <p className="text-gray-600 mb-4">
              GAFAS Tunisia was founded in 2020 with a mission to make premium eyewear accessible 
              to everyone in Tunisia. What started as a small boutique in Tunis has grown into 
              the country's leading online destination for sunglasses, eyeglasses, and eye care products.
            </p>
            <p className="text-gray-600 mb-6">
              We partner with the world's most prestigious brands to bring you authentic products 
              at competitive prices. Our team of certified optometrists ensures that every customer 
              receives professional guidance and personalized service.
            </p>
            <Link href="/marketplace" className="inline-flex items-center gap-2 text-yellow-600 font-medium hover:gap-3 transition-all">
              Shop Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600" 
              alt="Our Store"
              className="rounded-2xl shadow-2xl"
            />
            <div className="absolute -bottom-6 -left-6 bg-yellow-500 text-white p-6 rounded-2xl">
              <div className="text-4xl font-bold">4+</div>
              <div className="text-sm">Years of Excellence</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { number: '10,000+', label: 'Products' },
            { number: '5,000+', label: 'Happy Customers' },
            { number: '50+', label: 'Premium Brands' },
            { number: '15+', label: 'Cities Covered' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">{stat.number}</div>
              <div className="text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {values.map((value, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl text-center shadow-sm hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Meet Our Team</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <div key={i} className="text-center group">
                <div className="relative mb-4 overflow-hidden rounded-2xl">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="font-bold text-slate-900">{member.name}</h3>
                <p className="text-gray-500">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-yellow-500">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Look?</h2>
          <p className="text-xl mb-8 opacity-90">Browse our collection of premium eyewear</p>
          <Link href="/marketplace" className="inline-block bg-slate-900 text-white px-8 py-4 rounded-full font-bold hover:bg-slate-800 transition-colors">
            Shop Now
          </Link>
        </div>
      </section>
    </div>
  );
}
