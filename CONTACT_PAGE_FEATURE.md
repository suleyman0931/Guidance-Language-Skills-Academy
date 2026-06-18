# Contact Page Feature

## Overview
Added a dedicated contact page with email and SMS functionality that automatically includes the user's name in the message.

## Features Implemented

### 1. Contact Page (`/contact`)
- Beautiful, responsive contact page with gradient background
- Matches the design system (Navy Blue #0A2647 and Gold #C4A84F)
- Fully bilingual (English and Amharic)

### 2. Interactive Contact Options

#### Email Functionality
- Clicking "Send Email" opens default email client
- Pre-fills:
  - **To**: GuidanceAcademy@gmail.com
  - **Subject**: "Inquiry from Guidance Academy Website"
  - **Body**: "Hello, I'm [user's name]. [user's message]"
- If user is logged in, automatically uses their name
- If not logged in, uses the name they type in the form

#### SMS Functionality
- Clicking "Send SMS" opens SMS app
- Pre-fills:
  - **To**: 0909918195
  - **Message**: "Hello, I'm [user's name]. [user's message]"
- Automatically includes user's name in the greeting

#### Call Functionality
- Direct phone call link to: 0909918195
- One-click to dial

### 3. Contact Information Display
Four beautiful info cards showing:
- 📞 **Call Us**: 0909918195 / 0915260722
- ✉️ **Email Us**: GuidanceAcademy@gmail.com
- 💬 **Text Us**: SMS link
- 📍 **Location**: Harbu High School, Harbu

### 4. Navigation Integration
- Added "Contact" link to desktop navigation
- Added "Contact" link to mobile menu
- Added "Contact" link to footer (auto-generated from dict.links)

### 5. User Experience
- If user is logged in, their name is pre-filled
- Name field is editable (user can change it)
- Message field for custom message
- Two action buttons:
  - **Send Email**: Opens email client
  - **Send SMS**: Opens SMS app
- All contact methods are one-click accessible

## Files Created/Modified

### Created:
- `frontend/app/contact/page.tsx` - Main contact page component

### Modified:
- `frontend/lib/dict.ts` - Added contact page translations (English & Amharic)
- `frontend/app/layout.tsx` - Added Contact link to navigation (desktop + mobile)

## Contact Information
- **Email**: GuidanceAcademy@gmail.com
- **Phone**: 0909918195
- **Phone 2**: 0915260722
- **Address**: Harbu High School, Harbu

## Translation Keys Added

### English:
```typescript
contact: {
  title: 'Contact Us',
  sub: 'Get in touch with Guidance Academy',
  getInTouch: 'Get In Touch',
  reachOut: 'We\'d love to hear from you! Reach out via phone, email, or SMS.',
  yourName: 'Your Name',
  yourNamePh: 'Enter your name',
  message: 'Your Message',
  messagePh: 'Type your message here...',
  sendEmail: 'Send Email',
  sendSMS: 'Send SMS',
  callUs: 'Call Us',
  emailUs: 'Email Us',
  textUs: 'Text Us',
  location: 'Our Location',
  emailLabel: 'Email',
  phoneLabel: 'Phone',
  addressLabel: 'Address',
}
```

### Amharic:
```typescript
contact: {
  title: 'ያናግሩን',
  sub: 'ከጋይዳንስ አካዴሚ ጋር ይገናኙ',
  getInTouch: 'ያናግሩን',
  reachOut: 'ከእርስዎ መስማት እንፈልጋለን! በስልክ፣ ኢሜይል ወይም SMS ያግኙን።',
  // ... (full translations included)
}
```

## Usage Example

### Logged In User:
1. User "Suleyman Abdu" navigates to `/contact`
2. Name field automatically shows "Suleyman Abdu"
3. User types message: "I want to know about summer courses"
4. Clicks "Send Email"
5. Email opens with:
   ```
   To: GuidanceAcademy@gmail.com
   Subject: Inquiry from Guidance Academy Website
   Body: Hello,
   
   I'm Suleyman Abdu.
   
   I want to know about summer courses
   
   Best regards,
   Suleyman Abdu
   ```

### SMS Example:
1. User types their name: "Ahmed"
2. Types message: "When does the course start?"
3. Clicks "Send SMS"
4. SMS app opens with:
   ```
   To: 0909918195
   Message: Hello, I'm Ahmed. When does the course start?
   ```

## Testing Instructions

### 1. Test Contact Page
- Navigate to: http://localhost:3000/contact (local) or https://guidanceacademy.vercel.app/contact (production)
- Verify page loads with all elements

### 2. Test Email Functionality
- Enter your name
- Enter a message
- Click "Send Email"
- Verify email client opens with pre-filled content

### 3. Test SMS Functionality
- Enter your name
- Enter a message
- Click "Send SMS"
- Verify SMS app opens (mobile) or default SMS handler (desktop)

### 4. Test Call Functionality
- Click phone number in "Call Us" card
- Verify dialer opens with 0909918195

### 5. Test with Logged In User
- Login as a user
- Navigate to Contact page
- Verify name is pre-filled with user's name

### 6. Test Navigation
- Verify "Contact" link appears in:
  - Desktop navigation bar
  - Mobile menu
  - Footer "Quick Links" section

### 7. Test Language Toggle
- Toggle between English and Amharic
- Verify all text translates correctly

## Browser Compatibility
- **Email**: Works on all browsers (mailto: protocol)
- **SMS**: Works on mobile devices and desktop with SMS handlers
- **Call**: Works on mobile devices and desktop with VoIP apps

## Future Enhancements (Optional)
- [ ] Add Google Maps embed for location
- [ ] Add contact form with backend submission
- [ ] Add success toast notifications
- [ ] Add social media links (Telegram, Facebook, etc.)
- [ ] Add business hours information

---

**Status**: ✅ Implemented and ready for testing
**Date**: June 18, 2026
