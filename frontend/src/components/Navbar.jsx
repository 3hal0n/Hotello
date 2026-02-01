import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SignInButton, SignUpButton, UserButton, useAuth } from '@clerk/clerk-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isSignedIn } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const isActive = (path) => location.pathname === path;
  const isHomePage = location.pathname === '/';

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/hotels', label: 'Hotels' },
    { path: '/map', label: 'Map' },
    { path: '/chat', label: 'Chat' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  const navBaseClass = 'fixed top-0 left-0 right-0 z-50 transition-all duration-500';
  const transparentHomeClass = 'bg-transparent border-b border-white/10';
  const defaultScrolledClass = '<bg-blue-500></bg-blue-500> backdrop-blur-md border-b border-white/5 shadow-2xl';
  // Deep navy to match the hero "Discover Your Perfect Stay" card
  const siteColorClass = 'bg-gradient-to-r from-[#071029] via-[#07172b] to-[#0b2740] backdrop-blur-md border-b border-[#083047]/20 shadow-2xl';

  return (
    <>
      <nav className={`${navBaseClass} ${isHomePage && !isScrolled ? transparentHomeClass : (!isHomePage ? siteColorClass : defaultScrolledClass)}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute -inset-2 bg-amber-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <img
                  src="/logo.png"
                  alt="Hotello Logo"
                  className="relative w-9 h-9 object-contain"
                />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Hotello
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative text-sm font-medium transition-colors duration-300 ${
                    isActive(link.path)
                      ? 'text-amber-400'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive(link.path) && (
                    <span className="absolute -bottom-6 left-0 right-0 h-[2px] bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]"></span>
                  )}
                </Link>
              ))}
            </div>

            {/* Auth Buttons - Desktop */}
            <div className="hidden md:flex items-center space-x-6">
              {isSignedIn ? (
                <div className="flex items-center space-x-6 text-white/80">
                  <Link to="/wishlist" className="hover:text-amber-400 transition-colors">Wishlist</Link>
                  <Link to="/cart" className="hover:text-amber-400 transition-colors">Cart</Link>
                  <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "border-2 border-amber-400" } }}/>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <SignInButton mode="modal">
                    <button className="text-sm font-medium text-white hover:text-amber-400 transition-colors">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="px-5 py-2 text-sm font-bold text-black bg-amber-400 rounded-full hover:bg-white transition-all duration-300 shadow-[0_0_15px_rgba(251,191,36,0.3)]">
                      Sign Up
                    </button>
                  </SignUpButton>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden relative w-10 h-10 flex items-center justify-center text-white"
              aria-label="Toggle menu"
            >
              <div className="w-6 flex flex-col items-end gap-[5px]">
                <span className={`h-[2px] w-full bg-white rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
                <span className={`h-[2px] w-2/3 bg-amber-400 rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`h-[2px] w-full bg-white rounded-full transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* --- MOBILE MENU OVERLAY --- */}
      <div
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden transition-opacity duration-500 ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* --- MOBILE MENU PANEL (PREMIUM DARK THEME) --- */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-zinc-950 border-l border-white/10 z-50 md:hidden transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1) ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-zinc-900 to-zinc-950">
          
          {/* Header */}
          <div className="flex items-center justify-between p-8 border-b border-white/5">
            <span className="text-2xl font-serif font-bold text-white">
              Menu
            </span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/60 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Links */}
          <div className="flex-1 overflow-y-auto py-8 px-6 space-y-2">
            {navLinks.map((link, index) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-4 py-4 text-3xl font-light tracking-tight transition-all duration-300 ${
                  isActive(link.path)
                    ? 'text-amber-400 font-normal translate-x-2'
                    : 'text-zinc-400 hover:text-white hover:translate-x-2'
                }`}
                style={{
                  transitionDelay: `${index * 50}ms`,
                  opacity: isMobileMenuOpen ? 1 : 0,
                  transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(20px)'
                }}
              >
                {link.label}
              </Link>
            ))}
            
            {isSignedIn && (
              <Link
                to="/my-bookings"
                className="block px-4 py-4 text-xl font-light text-zinc-500 hover:text-white transition-all mt-8 border-t border-white/5 pt-8"
              >
                My Bookings
              </Link>
            )}
          </div>

          {/* Footer Auth */}
          <div className="p-8 border-t border-white/10 bg-zinc-900/50">
            {isSignedIn ? (
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Signed in as User</span>
                <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "w-10 h-10 border border-white/20" } }}/>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <SignInButton mode="modal">
                  <button className="w-full py-3.5 text-sm font-medium text-white border border-white/20 rounded-xl hover:bg-white/5 transition-colors">
                    Log In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="w-full py-3.5 text-sm font-bold text-black bg-amber-400 rounded-xl hover:bg-white transition-colors shadow-lg shadow-amber-900/20">
                    Sign Up
                  </button>
                </SignUpButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}