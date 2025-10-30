# Hotel Images Setup Guide

## Overview
This guide explains how to add hotel images to your Hotello project for local deployment and Vercel.

## Folder Structure

Create the following folder structure in your frontend project:

```
frontend/
  public/
    assets/
      img/
        {hotel-name-folder}/
          img1.jpg
          img2.jpg
          img3.jpg
          ... (up to img10.jpg)
```

## Hotel Name to Folder Name Conversion

The system automatically converts hotel names to folder names using this logic:
- Convert to lowercase
- Replace spaces with hyphens

**Examples:**

| Hotel Name in Database | Folder Name |
|------------------------|-------------|
| Luxury Beach Resort | luxury-beach-resort |
| Mountain View Hotel | mountain-view-hotel |
| City Center Inn | city-center-inn |
| Grand Palace Hotel | grand-palace-hotel |
| Seaside Paradise | seaside-paradise |

## Image Naming Convention

Inside each hotel folder, name your images:
- `img1.jpg` - Primary/featured image (shown on hotel cards)
- `img2.jpg` - Second image
- `img3.jpg` - Third image
- ... up to `img10.jpg`

**Note:** The system uses `img1.jpg` by default for hotel cards. You can add up to 10 images per hotel.

## Image Specifications

For best results:
- **Format:** JPG or PNG
- **Resolution:** Minimum 800x600px, recommended 1200x800px
- **Aspect Ratio:** 3:2 or 4:3 works best
- **File Size:** Optimize to under 500KB per image for faster loading

## Complete Example

For a hotel named "Luxury Beach Resort" in your database:

1. Create folder: `frontend/public/assets/img/luxury-beach-resort/`
2. Add images:
   - `luxury-beach-resort/img1.jpg` (featured image)
   - `luxury-beach-resort/img2.jpg`
   - `luxury-beach-resort/img3.jpg`
   - etc.

## Fallback Behavior

If an image is not found:
- The card will display a placeholder with a camera icon
- The hotel name will be shown in the placeholder
- No errors will be thrown

## Vercel Deployment

When deploying to Vercel:
1. Ensure all images are in `frontend/public/assets/img/`
2. The `public` folder is automatically served as static files
3. Images will be accessible at `/assets/img/{hotel-name}/img1.jpg`

## Current Hotels to Setup

Based on your seed data, create folders for these hotels:
1. luxury-beach-resort
2. mountain-view-hotel
3. city-center-inn
4. (Add more based on your database)

## Quick Checklist

- [ ] Create `frontend/public/assets/img/` folder
- [ ] For each hotel in your database:
  - [ ] Create a folder using the hotel name (lowercase, hyphens for spaces)
  - [ ] Add at least `img1.jpg` (primary image)
  - [ ] Add additional images (img2.jpg - img10.jpg) as needed
- [ ] Optimize all images (compress to under 500KB)
- [ ] Test locally to ensure images load
- [ ] Deploy to Vercel

## Testing

After adding images:
1. Run `npm run dev` in the frontend folder
2. Navigate to the hotels page
3. Verify all hotel cards show images
4. Check browser console for any 404 errors

## Troubleshooting

**Images not showing:**
- Check folder name matches hotel name (lowercase, hyphens)
- Verify file name is exactly `img1.jpg` (lowercase)
- Ensure file is in `frontend/public/assets/img/` not `frontend/src/`

**Images too large/slow:**
- Compress images using tools like TinyPNG or ImageOptim
- Resize to recommended dimensions (1200x800px)

## Notes

- The system no longer uses online URLs to avoid CORS issues on Vercel
- All images are served as static assets
- Update the seed script to match new hotel names if needed
