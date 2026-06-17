# 📸 Promotional Gallery - Quick Guide

## ✅ What Was Added

A beautiful **automatic image carousel/gallery** that displays promotional images on your landing page!

### Features:
- 🔄 **Auto-plays** every 5 seconds
- ← → **Manual navigation** with arrow buttons
- ⏸️ **Auto-pauses** when you interact with it
- 📱 **Fully responsive** (mobile & desktop)
- ✨ **Smooth transitions** and animations
- 🎯 **Dot navigation** to jump to any image

---

## 🚀 How to Add Promotional Images

### Step 1: Prepare Your Images
- **Size**: 1200x675px (16:9 ratio recommended)
- **Format**: JPG, PNG, or WEBP
- **File size**: Keep under 500KB for fast loading
- **Content**: Course announcements, events, achievements, etc.

### Step 2: Add Images to Folder
Save your images in: **`frontend/public/promo/`**

Name them:
- `promo-1.jpg`
- `promo-2.jpg`
- `promo-3.jpg`
- etc.

### Step 3: Update the Image List
Open **`frontend/components/PromoGallery.tsx`**

Find this section (near the top):
```typescript
const PROMO_IMAGES = [
  '/promo/promo-1.jpg',
  '/promo/promo-2.jpg',
  '/promo/promo-3.jpg',
  // Add more images here
];
```

Add your new images:
```typescript
const PROMO_IMAGES = [
  '/promo/promo-1.jpg',
  '/promo/promo-2.jpg',
  '/promo/promo-3.jpg',
  '/promo/promo-4.jpg',  // NEW
  '/promo/promo-5.jpg',  // NEW
];
```

### Step 4: Deploy
```bash
git add .
git commit -m "Add promotional images to gallery"
git push origin main
```

Vercel will auto-deploy and your images will appear! 🎉

---

## 📍 Where Does It Appear?

The gallery displays on the **landing page** between:
- "What You'll Learn" section (above)
- "Who Is It For" section (below)

---

## 🎨 Customization Options

### Change Auto-Play Speed
In `PromoGallery.tsx`, find:
```typescript
}, 5000);  // 5000 = 5 seconds
```
Change to:
```typescript
}, 3000);  // 3 seconds (faster)
}, 8000);  // 8 seconds (slower)
```

### Change Image Aspect Ratio
Find:
```typescript
<div className="relative aspect-video w-full overflow-hidden">
```
Change `aspect-video` to:
- `aspect-square` - Square images (1:1)
- `aspect-[4/3]` - Classic ratio (4:3)
- `aspect-[21/9]` - Ultra-wide (21:9)

### Disable Auto-Play
In `PromoGallery.tsx`, change:
```typescript
const [isAutoPlaying, setIsAutoPlaying] = useState(true);
```
to:
```typescript
const [isAutoPlaying, setIsAutoPlaying] = useState(false);
```

---

## 🎯 Example Use Cases

### Course Promotions
- Summer course announcements
- New program launches
- Early bird registration offers

### Events
- Graduation ceremonies
- Award ceremonies
- Workshop announcements

### Achievements
- Student success stories
- Test score improvements
- Competition winners

### Facilities
- Classroom photos
- Library/study areas
- Campus environment

---

## 🔧 Files Created

1. **`frontend/components/PromoGallery.tsx`** - Main gallery component
2. **`frontend/public/promo/`** - Folder for promotional images
3. **`frontend/public/promo/README.md`** - Instructions in the folder
4. **`PROMO_GALLERY_GUIDE.md`** - This guide

---

## ✨ Gallery Controls

### For Visitors:
- **← → Arrows**: Navigate manually
- **Dots at bottom**: Jump to specific image
- **Auto-advance**: Every 5 seconds (pauses when you click)
- **Counter (top right)**: Shows "3 / 5" etc.

### For Admins:
- Just add images to `/promo/` folder
- Update the array in `PromoGallery.tsx`
- Push to GitHub
- Vercel deploys automatically ✅

---

## 🎨 Design Details

- **Colors**: Matches your Navy Blue (#0A2647) and Gold (#C4A84F) theme
- **Style**: Glass-morphism effect matching your site design
- **Transitions**: Smooth 700ms fade between images
- **Hover Effects**: Arrows scale up on hover
- **Mobile**: Touch-friendly, responsive layout

---

## 📝 Need Help?

If an image doesn't show:
1. Check the filename matches exactly (including `.jpg` extension)
2. Verify the image is in `frontend/public/promo/` folder
3. Check the path in the array starts with `/promo/`
4. Make sure the image file isn't too large (< 500KB recommended)

---

**Status**: ✅ Ready to use! Just add your promotional images!
