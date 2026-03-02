'use client';

import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, Facebook, Instagram, Twitter, MessageCircle } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-gray-300">
            We'd love to hear from you. Get in touch with us.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Get in Touch</h2>
            
            <div className="space-y-6">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Visit Us</h3>
                  <p className="text-gray-600">
                    Avenue Habib Bourguiba<br />
                    Tunis 1000, Tunisia
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Call Us</h3>
                  <p className="text-gray-600">
                    +216 00 000 000<br />
                    +216 00 000 001
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Email Us</h3>
                  <p className="text-gray-600">
                    contact@gafas-tunisia.tn<br />
                    support@gafas-tunisia.tn
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Working Hours</h3>
                  <p className="text-gray-600">
                    Monday - Saturday: 9:00 AM - 8:00 PM<br />
                    Sunday: 10:00 AM - 6:00 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Social */}
            <div className="mt-8">
              <h3 className="font-bold text-slate-900 mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <a href="#" className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center hover:bg-yellow-500 hover:text-white transition-colors">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="#" className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center hover:bg-yellow-500 hover:text-white transition-colors">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="#" className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center hover:bg-yellow-500 hover:text-white transition-colors">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href="#" className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center hover:bg-yellow-500 hover:text-white transition-colors">
                  <MessageCircle className="w-6 h-6" />
                </a>
              </div>
            </div>

            {/* Map */}
            <div className="mt-8 rounded-2xl overflow-hidden h-64 bg-gray-100">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3194.224636538626!2d10.17167631526416!3d36.80649497923657!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12e2cb6a4c5a4a4a%3A0x2f3a4c5a4c5a4c5a!2sAvenue%20Habib%20Bourguiba%2C%20Tunis!5e0!3m2!1sen!2stn!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>

          {/* Form */}
          <div className="bg-gray-50 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Send us a Message</h2>
            
            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Message Sent!</h3>
                <p className="text-gray-600">Thank you for contacting us. We'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500"
                      placeholder="+216 00 000 000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500"
                    >
                      <option value="">Select subject</option>
                      <option value="order">Order Inquiry</option>
                      <option value="product">Product Question</option>
                      <option value="return">Returns & Exchanges</option>
                      <option value="partnership">Partnership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500 resize-none"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
