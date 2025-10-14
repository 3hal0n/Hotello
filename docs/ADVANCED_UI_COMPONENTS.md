# Hotello - Advanced UI Components

## 🎨 Implemented Features

### 1. **Hero Section - Home Page**

#### TextPressure Interactive Title
- **Component**: `TextPressure.jsx`
- **Features**:
  - Variable font effects (weight, width, italic)
  - Responds dynamically to mouse movement
  - Smooth interpolation with cursor tracking
  - Custom font support (Compressa VF)
- **Usage**: Hero title "Discover Sri Lanka"
- **Effect**: Text characters expand/contract as mouse moves over them

#### Dome Gallery 3D Carousel
- **Component**: `DomeGallery.jsx`
- **Features**:
  - Full 3D rotating dome of hotel images
  - Drag/swipe to rotate
  - Click to enlarge images
  - Smooth physics-based animations
  - Grayscale toggle
- **Configuration**:
  - `fit`: 0.75 (zoomed in 50% more)
  - `minRadius`: 800 (larger dome)
  - `segments`: 40 (smoother curves)

#### Particles Background
- **Component**: `Particles.jsx`
- **Features**:
  - 300 animated 3D particles
  - WebGL rendering with OGL library
  - Interactive hover effects
  - Blue color palette (#3b82f6, #60a5fa, #93c5fd)
  - Floating/rotating animations
- **Layers**:
  - Layer 0: Particles (background)
  - Layer 10: Dome Gallery (middle)
  - Layer 20: Text overlay (front)

### 2. **Hotel Details Page**

#### Circular Gallery
- **Component**: `CircularGallery.jsx`
- **Features**:
  - 3D curved gallery with WebGL
  - Drag/scroll to navigate
  - Rounded corners with smooth edges
  - Text labels under each image
  - Wave animation effects
  - Infinite loop scrolling
- **Configuration**:
  - `bend`: 3 (curvature amount)
  - `borderRadius`: 0.05 (rounded corners)
  - `scrollSpeed`: 2
  - `scrollEase`: 0.05 (smooth scrolling)

### 3. **Hotel Cards - Home Page**

#### ImageTrail Effect
- **Component**: `ImageTrail.jsx`
- **Features**:
  - Images follow mouse cursor on hover
  - Smooth GSAP animations
  - Fade in/out with scale effects
  - Trail of images appears as you move
  - Non-intrusive (doesn't block content)
- **Effect**: When hovering over hotel grid, all hotel images trail behind cursor

## 📦 Dependencies Installed

```json
{
  "@use-gesture/react": "^10.3.1",  // Gesture handling for Dome Gallery
  "gsap": "^3.13.0",                 // Animations for ImageTrail
  "ogl": "^1.0.11"                   // WebGL library for Particles & CircularGallery
}
```

## 🎯 User Experience

### Home Page Flow:
1. **Landing**: Full-screen hero with floating particles
2. **Interaction**: Move mouse over "Discover Sri Lanka" text
   - Text characters respond with variable font effects
3. **Gallery**: Drag the 3D dome to explore hotels
   - Click any image to enlarge
4. **Browse**: Scroll down to hotel cards
   - Move mouse around to see image trail effect
5. **Select**: Click "View Details" on any hotel

### Hotel Details Flow:
1. **Gallery**: Interactive circular 3D gallery
   - Drag/scroll to navigate through all hotel photos
   - Each image has label underneath
2. **Booking**: Fill in dates and reserve
3. **Payment**: Proceed to payment

## 🚀 Performance

- **WebGL Rendering**: Hardware-accelerated graphics
- **Debounced Events**: Optimized scroll/resize handlers
- **Lazy Loading**: Images load on demand
- **RAF Animations**: Smooth 60fps animations
- **Responsive**: Works on desktop, tablet, mobile

## 🎨 Design Features

### Color Palette:
- **Hero**: Black background (#000000)
- **Particles**: Blue gradient (#3b82f6 → #60a5fa → #93c5fd)
- **Text**: White (#ffffff) with drop shadows
- **Cards**: White (#ffffff) on gray-50 background

### Animations:
- **Smooth Easing**: Power curves, expo easing
- **Physics**: Inertia-based scrolling
- **Transitions**: 300-500ms for most effects
- **Hover States**: Shadow elevation, scale transforms

## 📱 Mobile Support

All components are fully responsive:
- Touch events supported
- Gesture recognition
- Viewport-optimized sizing
- Mobile-friendly controls

## 🔧 Customization

Each component accepts extensive props for customization:
- Colors, sizes, speeds
- Animation curves, durations
- Particle counts, spreads
- Border radius, padding
- And many more...

## ✨ Highlights

1. **Stunning Visual Impact**: Multiple layers of animation create depth
2. **Interactive**: Every element responds to user input
3. **Modern**: Uses latest WebGL and animation techniques
4. **Professional**: Industry-standard shadcn-style components
5. **Performant**: Optimized for smooth 60fps

## 🎬 Demo Effects

Try these:
1. Move mouse slowly over hero title
2. Drag the dome left and right
3. Click a dome image to enlarge
4. Move mouse around hotel cards section
5. Navigate circular gallery on hotel details

Enjoy your stunning new Hotello website! 🏨✨
