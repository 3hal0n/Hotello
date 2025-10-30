import { useState, useEffect } from "react";
import { Search, Sparkles, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import hotel1 from "@/assets/hotel-1.jpg";
import hotel2 from "@/assets/hotel-2.jpg";
import hotel3 from "@/assets/hotel-3.jpg";
import hotel4 from "@/assets/hotel-4.jpg";
import "./Hero.css";

const slides = [
  {
    image: hotel1,
    title: "Find Hotels That Match Your Mood",
    subtitle: "Experience luxury tailored to your emotions",
  },
  {
    image: hotel2,
    title: "Book Luxury. Feel Inspired.",
    subtitle: "Where comfort meets elegance",
  },
  {
    image: hotel3,
    title: "Discover the Perfect Stay — Powered by AI",
    subtitle: "Your dream destination awaits",
  },
  {
    image: hotel4,
    title: "Escape to Extraordinary",
    subtitle: "Redefine your travel experience",
  },
];

const Hero = ({ onEmotionSearch }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchMode, setSearchMode] = useState("destination");
  const [searchQuery, setSearchQuery] = useState("");
  const [emotionQuery, setEmotionQuery] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const handleSearch = () => {
    if (searchMode === "emotion" && onEmotionSearch) {
      onEmotionSearch(emotionQuery);
    } else {
      console.log(`Searching ${searchMode}:`, searchQuery);
      // Traditional search logic
    }
  };

  const emotions = [
    { emoji: "😌", label: "Relaxing", query: "peaceful relaxing spa wellness quiet serene" },
    { emoji: "🎉", label: "Exciting", query: "vibrant nightlife entertainment activities adventure" },
    { emoji: "💑", label: "Romantic", query: "romantic couples intimate cozy candlelit" },
    { emoji: "👨‍👩‍👧‍👦", label: "Family", query: "family kids children playground activities pool" },
    { emoji: "💼", label: "Business", query: "business conference meeting workspace professional" },
    { emoji: "🏖️", label: "Beach", query: "beach ocean seaside coastal beachfront" },
  ];

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Carousel */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center animate-dome-rotate"
              style={{
                backgroundImage: `url(${slide.image})`,
                filter: index === currentSlide ? "blur(0px)" : "blur(8px)",
              }}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-overlay" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        {/* Logo */}
        <div className="mb-8 animate-fade-in">
          <h1 className="font-serif text-5xl font-light tracking-wider text-primary-foreground md:text-7xl">
            Hotello
          </h1>
          <div className="mx-auto mt-2 h-px w-32 bg-gradient-gold" />
        </div>

        {/* Dynamic Title */}
        <div className="mb-8 animate-fade-in">
          <h2 className="mb-3 text-3xl font-light text-primary-foreground md:text-5xl">
            {slides[currentSlide].title}
          </h2>
          <p className="text-lg text-primary-foreground/80 md:text-xl">
            {slides[currentSlide].subtitle}
          </p>
        </div>

        {/* AI Emotion Search Section */}
        <div className="mb-12 w-full max-w-4xl animate-fade-in">
          {/* Search Mode Toggle */}
          <div className="mb-4 flex justify-center gap-2">
            <button
              onClick={() => setSearchMode("destination")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                searchMode === "destination"
                  ? "bg-gold text-gray-900"
                  : "bg-primary-foreground/10 text-primary-foreground backdrop-blur-glass hover:bg-primary-foreground/20"
              }`}
            >
              <MapPin className="inline-block mr-2 w-4 h-4" />
              Destination
            </button>
            <button
              onClick={() => setSearchMode("emotion")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                searchMode === "emotion"
                  ? "bg-gold text-gray-900"
                  : "bg-primary-foreground/10 text-primary-foreground backdrop-blur-glass hover:bg-primary-foreground/20"
              }`}
            >
              <Sparkles className="inline-block mr-2 w-4 h-4" />
              AI Emotion Search
            </button>
          </div>

          {/* Search Input */}
          {searchMode === "destination" ? (
            <div className="relative backdrop-blur-glass rounded-2xl bg-primary-foreground/10 border border-primary-foreground/20 p-2">
              <div className="flex items-center gap-2">
                <MapPin className="ml-4 h-5 w-5 text-primary-foreground/70" />
                <Input
                  type="text"
                  placeholder="Search by location or hotel name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 border-0 bg-transparent text-primary-foreground placeholder:text-primary-foreground/50 focus-visible:ring-0"
                />
                <Button
                  onClick={handleSearch}
                  className="bg-gradient-gold hover:bg-gradient-gold px-8 text-gray-900 font-semibold"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Emotion Input */}
              <div className="relative backdrop-blur-glass rounded-2xl bg-primary-foreground/10 border border-primary-foreground/20 p-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="ml-4 h-5 w-5 text-primary-foreground/70" />
                  <Input
                    type="text"
                    placeholder="How do you want to feel? (e.g., relaxed, adventurous, romantic...)"
                    value={emotionQuery}
                    onChange={(e) => setEmotionQuery(e.target.value)}
                    className="flex-1 border-0 bg-transparent text-primary-foreground placeholder:text-primary-foreground/50 focus-visible:ring-0"
                  />
                  <Button
                    onClick={handleSearch}
                    className="bg-gradient-gold hover:bg-gradient-gold px-8 text-gray-900 font-semibold"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Find Hotels
                  </Button>
                </div>
              </div>

              {/* Emotion Quick Buttons */}
              <div className="flex flex-wrap justify-center gap-3">
                {emotions.map((emotion) => (
                  <button
                    key={emotion.label}
                    onClick={() => {
                      setEmotionQuery(emotion.label);
                      if (onEmotionSearch) onEmotionSearch(emotion.query);
                    }}
                    className="group px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-glass border border-primary-foreground/20 hover:bg-gold hover:border-gold transition-all hover:scale-105"
                  >
                    <span className="text-2xl mr-2">{emotion.emoji}</span>
                    <span className="text-sm font-medium text-primary-foreground group-hover:text-gray-900">
                      {emotion.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide
                  ? "w-8 bg-gold"
                  : "w-2 bg-primary-foreground/30 hover:bg-primary-foreground/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
