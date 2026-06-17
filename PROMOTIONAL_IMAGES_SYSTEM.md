# 📸 Promotional Images System - Complete Guide

## ✅ What Was Built

A **full-stack promotional image management system** where admins can upload images through the admin panel, and they automatically display on the landing page!

### System Components:
1. **Database** - Stores image metadata
2. **Backend API** - Handles uploads & management
3. **Admin Panel** - Upload & manage images
4. **Public Gallery** - Auto-displays active images

---

## 🚀 How to Use (For Admins)

### Step 1: Login as Admin
- Go to: `https://guidanceacademy.vercel.app/login`
- Username: `admin`
- Password: `Admin@2024!`

### Step 2: Navigate to Promotions
- Click **📸 Promotions** in the admin sidebar

### Step 3: Upload Promotional Image
1. Click **"+ Upload Image"** button
2. Select an image file (JPG, PNG, WEBP - Max 2MB)
3. Optionally add:
   - **Title** - Displays on the image
   - **Description** - Shows below title
   - **Display Order** - Controls sequence (0=first)
4. Click **"Upload"**
5. ✅ Done! Image appears on landing page immediately!

### Step 4: Manage Images
- **Activate/Deactivate** - Toggle visibility
- **Delete** - Remove permanently
- **Reorder** - Change display_order number

---

## 📍 Where Images Appear

**Landing Page** (`https://guidanceacademy.vercel.app`)
- Between "What You'll Learn" and "Who Is It For" sections
- Auto-plays every 5 seconds
- Manual navigation with arrows
- Responsive on mobile & desktop

---

## 🎨 Features

### For Admins:
✅ **Drag & Drop Upload** (click to browse)
✅ **Image Preview** before upload
✅ **Activate/Deactivate** without deleting
✅ **Display Order** control
✅ **Title & Description** overlay
✅ **Real-time Updates** - No page refresh needed

### For Visitors:
✅ **Auto-Play Gallery** (5 second intervals)
✅ **Manual Navigation** (←→ arrows)
✅ **Dot Indicators** (click to jump)
✅ **Image Counter** (e.g., "3 / 5")
✅ **Smooth Transitions** (fade effects)
✅ **Title Overlay** (if admin added one)
✅ **Mobile Responsive**

---

## 🔧 Technical Details

### Database Table: `promotional_images`
```sql
- id (auto-increment)
- title (optional string)
- image_url (stored path)
- description (optional text)
- display_order (integer, default 0)
- is_active (boolean, default true)
- created_at, updated_at (timestamps)
```

### API Endpoints

#### Public:
- `GET /api/promotional-images` - Get all active images

#### Admin (requires auth):
- `GET /admin/promotional-images` - Get all images
- `POST /admin/promotional-images` - Upload new image
- `PUT /admin/promotional-images/{id}` - Update image details
- `PATCH /admin/promotional-images/{id}/toggle` - Toggle active status
- `DELETE /admin/promotional-images/{id}` - Delete image

### File Storage:
- Images stored in: `backend/storage/app/public/promotional_images/`
- Accessible via: `https://guidance-language-skills-academy.onrender.com/storage/promotional_images/...`
- Filenames: `promo_{timestamp}_{random}.{ext}`

---

## 📸 Image Specifications

### Recommended:
- **Size**: 1200 x 675px (16:9 aspect ratio)
- **Format**: JPG, PNG, or WEBP
- **File Size**: Under 500KB for fast loading
- **Max Upload**: 2MB

### Accepted Formats:
- `.jpg` / `.jpeg`
- `.png`
- `.webp`

---

## 🎯 Use Cases

### Course Promotions:
- Summer course announcements
- New program launches
- Registration deadlines
- Early bird offers

### Events:
- Graduation ceremonies
- Award ceremonies
- Workshops & seminars
- Guest speaker visits

### Achievements:
- Student success stories
- Test score improvements
- Competition winners
- Scholarship awards

### Facilities & Campus:
- Classroom photos
- Library/study areas
- Computer labs
- Campus environment

---

## 🔄 Workflow Example

1. **Admin uploads** image with title "Summer Course 2024"
2. **Backend stores** in database & file system
3. **Gallery fetches** via API call
4. **Image displays** on landing page automatically
5. **Visitors see** in rotating carousel
6. **Admin can** deactivate or delete anytime

---

## 🛠️ Files Created/Modified

### Backend:
1. `backend/database/migrations/..._create_promotional_images_table.php` - Database schema
2. `backend/app/Models/PromotionalImage.php` - Eloquent model
3. `backend/app/Http/Controllers/PromotionalImageController.php` - API controller
4. `backend/routes/api.php` - API routes
5. `backend/config/filesystems.php` - File storage config
6. `backend/docker/entrypoint.sh` - Storage link setup

### Frontend:
1. `frontend/components/PromoGallery.tsx` - Public gallery component
2. `frontend/app/admin/promotions/page.tsx` - Admin management page
3. `frontend/app/admin/layout.tsx` - Added navigation link
4. `frontend/lib/api.ts` - API functions
5. `frontend/app/page.tsx` - Added gallery to landing page

---

## 🚀 Deployment

### Frontend (Vercel):
- Auto-deploys from GitHub `main` branch
- No additional configuration needed
- Images fetch from backend API

### Backend (Render):
- Run migrations: `php artisan migrate`
- Create storage link: `php artisan storage:link`
- Upload images via admin panel

---

## 🐛 Troubleshooting

### Image doesn't appear after upload:
1. Check if image is marked as "Active"
2. Verify image uploaded successfully (check admin panel)
3. Hard refresh landing page (Ctrl+Shift+R)
4. Check browser console for API errors

### Upload fails:
1. Check file size (max 2MB)
2. Verify file format (JPG, PNG, WEBP only)
3. Check admin is logged in
4. Check backend server is running

### Images not displaying on landing page:
1. Open browser console (F12)
2. Check for API errors
3. Verify backend URL is correct in `.env`
4. Check CORS settings

---

## 📚 Admin Panel Features

### Image Grid View:
- Thumbnail previews
- Title & description display
- Status badge (Active/Inactive)
- Display order number
- Creation date
- Quick actions (Toggle/Delete)

### Upload Form:
- File selector with drag & drop
- Title input (optional)
- Description textarea (optional)
- Display order input
- Real-time validation
- Progress indicator

### Actions:
- **Activate/Deactivate** - Toggle without deleting
- **Delete** - Permanent removal (with confirmation)
- **View** - See how it looks on landing page

---

## 🎨 Design Integration

- **Colors**: Matches Navy Blue (#0A2647) & Gold (#C4A84F) theme
- **Styling**: Glass-morphism effects
- **Animations**: Smooth fade transitions
- **Responsive**: Mobile-friendly layout
- **Accessibility**: Keyboard navigation, ARIA labels

---

## ✨ Future Enhancements (Optional)

### Possible additions:
- [ ] Drag & drop reordering
- [ ] Bulk upload multiple images
- [ ] Image cropping/editing
- [ ] Schedule images (start/end dates)
- [ ] Click tracking/analytics
- [ ] Link images to specific pages
- [ ] Categories/tags for images
- [ ] Image optimization on upload

---

## 📖 Quick Reference

### Admin URL:
`https://guidanceacademy.vercel.app/admin/promotions`

### Public Gallery:
`https://guidanceacademy.vercel.app` (landing page, scroll down)

### API Endpoint:
`https://guidance-language-skills-academy.onrender.com/api/promotional-images`

---

**Status**: ✅ Fully functional & ready to use!

**Next Step**: Login as admin and upload your first promotional image! 🎉
