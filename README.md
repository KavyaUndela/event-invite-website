# InviteSphere – Smart Event & Wedding Invitation Platform

**Your celebration, beautifully organized.**

InviteSphere is a modern, responsive event invitation platform featuring live countdown, Google Maps integration, RSVP submission, and an admin dashboard. Built with **Firebase Firestore** for real-time data syncing, it's a fully static site that runs on GitHub Pages with no backend server required.

## ✨ Features

✨ **Guest-Facing Features**
- Professional landing page with event details
- RSVP registration form with real-time Firestore sync
- Live countdown timer
- Responsive design with beautiful animations
- Guest event selection dropdown
- Wedding celebration special styling

🔐 **Admin Dashboard**
- Secure Firebase Authentication (email/password, Google Sign-In)
- Create and manage events
- View all RSVPs in a sortable, real-time table
- Real-time statistics (attendance count, guest count)
- Logout functionality with session management

🗺️ **Maps Integration**
- Google Maps embedded on venue page
- Location-aware event displays

💾 **Database Integration**
- **Firebase Firestore** - Cloud database with real-time sync
- **localStorage** - Automatic fallback for offline support

## Tech Stack

- **Backend**: Firebase (Authentication + Firestore)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6 Modules)
- **Hosting**: GitHub Pages (fully static)
- **Styling**: Modern CSS with gradients, animations, responsive design

## 🌐 Live Demo

**Visit**: [https://kavyaundela.github.io/event-invite-website/](https://kavyaundela.github.io/event-invite-website/)

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/KavyaUndela/event-invite-website.git
cd event-invite-website
```

### 2. Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable **Authentication** (Email/Password + Google)
4. Create **Firestore Database** (production mode)
5. Update `public/js/firebase-config.js` with your credentials
6. Set Firestore Rules to allow read/write on `/rsvps` collection

### 3. That's It!

This is a **fully static site** - no server installation needed. Visit the live GitHub Pages site above or open `public/index.html` locally.

## Usage

### For Guests
1. Click **"Get Started"**
2. Select **"Guest Access"**
3. Choose an event
4. Submit RSVP → Saves to Firebase Firestore

### For Admins
1. Click **"Get Started"** → **"Admin"** tab
2. Sign in (Firebase email/password or Google)
3. Create events and view RSVPs in real-time

## 🔒 Security

- Firebase Web API key is safe (Firebase SDK designed for client-side use)
- Service account keys NOT in repository
- Firestore production rules implemented
- All data encrypted in transit

## 📱 Browser Support

✅ Chrome, Firefox, Safari, Edge (latest versions)
✅ iOS Safari, Chrome Mobile

## 📝 License

MIT License - Use freely for your events!

---

**Built with ❤️ for celebrations**
