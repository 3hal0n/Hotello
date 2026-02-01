import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const seoData = {
  '/': {
    title: 'Hotello - AI-Powered Hotel Booking in Sri Lanka | Best Prices Guaranteed',
    description: 'Discover and book the perfect hotel in Sri Lanka with Hotello\'s AI-powered search. Compare prices, get personalized recommendations, and enjoy seamless booking.',
    keywords: 'hotel booking Sri Lanka, AI hotel search, best hotel prices, hotel booking platform, accommodation Sri Lanka',
    ogImage: '/bg-hero.webp',
  },
  '/hotels': {
    title: 'Browse Hotels in Sri Lanka | Hotello',
    description: 'Explore our curated collection of hotels across Sri Lanka. Filter by location, price, amenities, and let our AI find your perfect match.',
    keywords: 'Sri Lanka hotels, hotel search, accommodation finder, hotel listings Sri Lanka',
    ogImage: '/bg-hero.webp',
  },
  '/map': {
    title: 'Hotel Map View - Find Hotels Near You | Hotello',
    description: 'Explore hotels on an interactive map. Discover accommodations near your favorite destinations in Sri Lanka with real-time availability.',
    keywords: 'hotel map, interactive hotel search, hotels near me, Sri Lanka map',
    ogImage: '/bg-hero.webp',
  },
  '/chat': {
    title: 'AI Travel Assistant - Chat with Hotello AI',
    description: 'Get instant hotel recommendations from our intelligent AI chatbot. Ask questions, compare options, and book directly through our conversational interface.',
    keywords: 'AI travel assistant, hotel chatbot, AI booking assistant, travel recommendations',
    ogImage: '/bg-hero.webp',
  },
  '/about': {
    title: 'About Hotello - AI-Powered Hotel Booking Platform',
    description: 'Learn about Hotello\'s mission to revolutionize hotel booking in Sri Lanka with AI technology, personalized service, and unbeatable prices.',
    keywords: 'about hotello, AI hotel booking, travel technology, hotel booking innovation',
    ogImage: '/logo.png',
  },
  '/contact': {
    title: 'Contact Us - Get in Touch with Hotello',
    description: 'Have questions or need assistance? Contact Hotello\'s customer support team. We\'re here to help you plan your perfect stay.',
    keywords: 'contact hotello, customer support, hotel booking help, travel assistance',
    ogImage: '/logo.png',
  },
  '/cart': {
    title: 'Your Cart - Complete Your Booking | Hotello',
    description: 'Review your selected hotels and complete your booking with secure payment options.',
    keywords: 'hotel cart, booking checkout, hotel reservation',
    ogImage: '/logo.png',
  },
  '/wishlist': {
    title: 'Your Wishlist - Saved Hotels | Hotello',
    description: 'View your saved hotels and dream destinations. Book when you\'re ready or share with friends.',
    keywords: 'hotel wishlist, saved hotels, favorite accommodations',
    ogImage: '/logo.png',
  },
  '/profile': {
    title: 'Your Profile - Manage Your Account | Hotello',
    description: 'Manage your bookings, preferences, and account settings.',
    keywords: 'user profile, account settings, booking history',
    ogImage: '/logo.png',
  },
};

export const SEO = () => {
  const location = useLocation();

  useEffect(() => {
    // Get SEO data for current route or use default
    const currentPath = location.pathname;
    const data = seoData[currentPath] || seoData['/'];

    // Update document title
    document.title = data.title;

    // Update or create meta tags
    const updateMetaTag = (name, content, property = false) => {
      const attribute = property ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Update meta description
    updateMetaTag('description', data.description);
    updateMetaTag('keywords', data.keywords);

    // Update Open Graph tags
    updateMetaTag('og:title', data.title, true);
    updateMetaTag('og:description', data.description, true);
    updateMetaTag('og:url', `https://hotello-ebon.vercel.app${currentPath}`, true);
    updateMetaTag('og:image', `https://hotello-ebon.vercel.app${data.ogImage}`, true);

    // Update Twitter Card tags
    updateMetaTag('twitter:title', data.title);
    updateMetaTag('twitter:description', data.description);
    updateMetaTag('twitter:image', `https://hotello-ebon.vercel.app${data.ogImage}`);

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `https://hotello-ebon.vercel.app${currentPath}`);

  }, [location]);

  return null;
};

export default SEO;
