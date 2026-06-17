# Testing Checklist - Post Deployment

## ⏳ Step 1: Wait for Deployment (5-7 minutes)

### Check Render Dashboard
1. Go to: https://dashboard.render.com
2. Find: "guidance-language-skills-academy" service
3. Wait for status to show: **"Live"** (green indicator)
4. Check "Events" tab for: "Deploy succeeded"

### Latest Commit
```
d3d565b - Fix CORS by adding headers in nginx + add suleyman.png to about page
```

---

## ✅ Step 2: Test CORS (Critical)

### Test 1: Registration Form
1. Open: https://guidanceacademy.vercel.app/register
2. Open Browser DevTools (F12)
3. Go to **Network** tab
4. Fill registration form with test data:
   - Name (English): Test Student
   - Name (Amharic): ፈተና ተማሪ
   - Phone: 0912345678
   - Grade: Grade 10
   - Purpose: Language Learning
   - Referral: Friend
5. Click **Submit**
6. **Check for:**
   - ✅ NO red errors in console
   - ✅ Request shows status 200 (not ERR_FAILED)
   - ✅ Response headers include:
     ```
     Access-Control-Allow-Origin: https://guidanceacademy.vercel.app
     Access-Control-Allow-Credentials: true
     ```

### Test 2: Health Endpoint
Visit: https://guidance-language-skills-academy.onrender.com/api/health

Should return:
```json
{
  "status": "ok",
  "service": "Guidance Academy API",
  "timestamp": "2026-06-17T..."
}
```

---

## ✅ Step 3: Test Authentication

### Login as Admin
1. Go to: https://guidanceacademy.vercel.app/login
2. Enter credentials:
   - **Username**: `admin`
   - **Password**: `Admin@2024!`
3. Click **Login**
4. Should redirect to: `/admin` dashboard
5. **Check:**
   - ✅ No CORS errors
   - ✅ Dashboard loads correctly
   - ✅ Navigation menu shows all sections

---

## ✅ Step 4: Test Promotional Images System

### Upload Test Image
1. From admin dashboard, click **Promotions** in sidebar
2. Click **Upload Image** button
3. Select image file from `frontend/public/promo/` folder
4. Add details:
   - **Title**: Test Promotion
   - **Description**: Testing the gallery system
   - **Display Order**: 0
5. Click **Upload**
6. **Check:**
   - ✅ No CORS errors during upload
   - ✅ Image appears in admin list
   - ✅ Image shows preview thumbnail
   - ✅ Status shows "Active"

### Test Toggle & Delete
1. Click **Deactivate** button
2. **Check:** Status changes to "Inactive"
3. Click **Activate** button
4. **Check:** Status changes back to "Active"
5. Upload 2-3 more images
6. Visit homepage: https://guidanceacademy.vercel.app
7. **Check:**
   - ✅ Gallery displays on homepage
   - ✅ Images auto-advance every 5 seconds
   - ✅ Navigation arrows work
   - ✅ Dot indicators work
   - ✅ Image counter shows correctly

---

## ✅ Step 5: Test About Page

### Verify Photo Display
1. Go to: https://guidanceacademy.vercel.app/about
2. Scroll to "Meet Our Trainer" section
3. **Check:**
   - ✅ Suleyman's photo displays (not "SA" badge)
   - ✅ Photo loads correctly
   - ✅ Name and title show below photo
   - ✅ Contact phone numbers display

---

## ✅ Step 6: Test All Admin Functions

### Students Management
1. Go to: `/admin/students`
2. **Check:**
   - ✅ List of registered students loads
   - ✅ Search works
   - ✅ Status filter works
   - ✅ Can update student status
   - ✅ Can view student details

### Posts Management
1. Go to: `/admin/posts`
2. Click **Create Post**
3. Fill in test post:
   - Title (EN): Test Announcement
   - Title (AM): ፈተና ማስታወቂያ
   - Body: Test content
   - Type: Announcement
4. Click **Create**
5. **Check:**
   - ✅ Post appears in admin list
   - ✅ Can toggle publish/unpublish
   - ✅ Can edit post
   - ✅ Can delete post

---

## ✅ Step 7: Test Public Pages

### Homepage
- Visit: https://guidanceacademy.vercel.app
- **Check:**
  - ✅ Logo displays in header
  - ✅ Promotional gallery shows (if images uploaded)
  - ✅ All sections load
  - ✅ Language toggle works (AM ↔ EN)
  - ✅ Footer displays with logo

### About Page
- Visit: https://guidanceacademy.vercel.app/about
- **Check:**
  - ✅ All sections display
  - ✅ Trainer photo shows
  - ✅ Location says "Harbu" (not "Jimma")
  - ✅ Contact information correct

### Registration Page
- Visit: https://guidanceacademy.vercel.app/register
- **Check:**
  - ✅ Form displays correctly
  - ✅ All fields present
  - ✅ Validation works
  - ✅ Submit works without CORS errors

---

## ✅ Step 8: Browser Console Check

### Check for Errors
1. Open DevTools Console (F12)
2. Navigate through all pages
3. **Should NOT see:**
   - ❌ CORS errors
   - ❌ Failed to load resource errors
   - ❌ Network ERR_FAILED
   - ❌ Access-Control-Allow-Origin errors

4. **Acceptable warnings:**
   - ⚠️ Cookie warnings (if any)
   - ⚠️ Image optimization suggestions

---

## 🐛 Troubleshooting

### If CORS Errors Persist

1. **Check Render Deployment**
   - Verify "Live" status
   - Check deployment timestamp (should be recent)
   - View logs for nginx errors

2. **Clear Browser Cache**
   - Hard refresh: Ctrl + Shift + R (Windows) / Cmd + Shift + R (Mac)
   - Or open in incognito/private mode

3. **Check Headers with curl**
   ```bash
   curl -I https://guidance-language-skills-academy.onrender.com/api/health
   ```
   Should include: `Access-Control-Allow-Origin`

4. **Verify nginx Config**
   - Check Render logs for nginx startup
   - Look for "nginx: configuration file test successful"

### If Images Don't Upload

1. Check storage folder exists:
   - Render logs should show: "Creating storage link..."
2. Verify file permissions
3. Check upload size limits (max 2MB)
4. Try smaller test image

### If Login Fails

1. Verify admin user was seeded:
   - Render logs: "Seeding database (first run)..."
2. Try password reset if needed
3. Check database connection

---

## 📊 Success Criteria

All tests pass when:
- ✅ No CORS errors anywhere
- ✅ Registration form works
- ✅ Admin login works
- ✅ Can upload promotional images
- ✅ Gallery displays on homepage
- ✅ About page shows correct photo
- ✅ All CRUD operations work
- ✅ No console errors

---

## 📞 Contact

If issues persist after all tests:
1. Share Render deployment logs
2. Share browser console errors
3. Share network tab screenshots

---

**Last Updated**: June 17, 2026  
**Deployment**: d3d565b  
**Estimated Test Time**: 15-20 minutes
