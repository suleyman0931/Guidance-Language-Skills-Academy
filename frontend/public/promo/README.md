# Promotional Images Gallery

## How to Add Promotional Images

### Simple Method (3 Steps):

1. **Save your promotional images** in this folder (`frontend/public/promo/`)
   - Name them: `promo-1.jpg`, `promo-2.jpg`, `promo-3.jpg`, etc.
   - Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`
   - Recommended size: **1200x675px** (16:9 aspect ratio)

2. **Update the image list** in `frontend/components/PromoGallery.tsx`
   - Open the file and find the `PROMO_IMAGES` array
   - Add your new image filename to the array
   ```typescript
   const PROMO_IMAGES = [
     '/promo/promo-1.jpg',
     '/promo/promo-2.jpg',
     '/promo/promo-3.jpg',
     '/promo/promo-4.jpg',  // Add new images here
   ];
   ```

3. **Deploy** - The gallery will automatically update!

### Features:

✅ **Auto-play**: Images change automatically every 5 seconds
✅ **Manual Navigation**: Click arrows to browse manually
✅ **Pause on Interaction**: Auto-play pauses when you click arrows
✅ **Responsive**: Works perfectly on mobile and desktop
✅ **Smooth Transitions**: Professional fade effects
✅ **Counter**: Shows current image number (e.g., "2 / 5")
✅ **Dots Navigation**: Click dots to jump to specific image

### Tips:

- Use high-quality images (minimum 1200px wide)
- Keep file sizes under 500KB for fast loading
- Use descriptive filenames (e.g., `summer-course-2024.jpg`)
- Images display in the order listed in the array

### Example Images:

Place promotional images like:
- Course announcements
- Event posters
- Achievement highlights
- Student success stories
- Upcoming programs
- Special offers

---

**Location**: Images appear on the landing page between "What You'll Learn" and "Who Is It For" sections.
