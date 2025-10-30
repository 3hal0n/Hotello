import React from 'react';
import { Shield, Bot, Sparkles, CreditCard, MessageSquare, Search } from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'Protected by industry-leading encryption and Stripe payment processing for your peace of mind.',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
    },
    {
      icon: MessageSquare,
      title: 'AI Chatbot Assistant',
      description: '24/7 intelligent support powered by AI to help you find the perfect hotel and answer all your questions.',
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
    },
    {
      icon: Sparkles,
      title: 'Emotion-Based Search',
      description: 'Find hotels that match your mood. Tell us how you want to feel, and our AI will find the perfect match.',
      gradient: 'from-amber-500 to-orange-500',
      bgGradient: 'from-amber-50 to-orange-50',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Choose Hotello?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the future of hotel booking with our innovative features designed to make your journey seamless
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl bg-white border border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {/* Content */}
                <div className="relative p-8">
                  {/* Icon Container */}
                  <div className={`mb-6 inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-gray-900 group-hover:to-gray-700 transition-all duration-300">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    {feature.description}
                  </p>

                  {/* Decorative Element */}
                  <div className={`absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-br ${feature.gradient} opacity-5 group-hover:opacity-10 rounded-full blur-2xl transition-opacity duration-500`} />
                </div>

                {/* Bottom Accent Line */}
                <div className={`h-1 w-0 group-hover:w-full bg-gradient-to-r ${feature.gradient} transition-all duration-500`} />
              </div>
            );
          })}
        </div>

        {/* Additional Info Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Best Price Guarantee */}
          <div className="flex items-start gap-4 p-6 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
            <div className="flex-shrink-0 p-3 bg-green-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Best Price Guarantee</h4>
              <p className="text-sm text-gray-600">
                Find a lower price elsewhere? We'll match it and give you an extra 10% off.
              </p>
            </div>
          </div>

          {/* Smart Recommendations */}
          <div className="flex items-start gap-4 p-6 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
            <div className="flex-shrink-0 p-3 bg-indigo-100 rounded-lg">
              <Search className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Smart Recommendations</h4>
              <p className="text-sm text-gray-600">
                AI-powered suggestions based on your preferences and past bookings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
