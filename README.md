# InviteSphere – Smart Event & Wedding Invitation Platform

**Your celebration, beautifully organized.**

InviteSphere is a modern, responsive event invitation platform featuring live countdown, Google Maps integration, RSVP submission, and an admin dashboard. Built with Node.js, Express, and MongoDB, it delivers a professional experience for guests and hosts.

## ✨ Features

✨ **Guest-Facing Features**
- Professional landing page with event details
- RSVP registration form
- Live countdown timer
- Responsive design

🔐 **Admin Dashboard**
- Secure login system
- View all RSVPs in a sortable table
- Real-time statistics (attendance, guest count)
- Refresh and logout functionality

💾 **Database Integration**
- **MongoDB** - Primary database (optional but recommended)
- **JSON Fallback** - Works without MongoDB setup

## Tech Stack

- **Backend**: Node.js + Express.js
- **Storage**: JSON file (data/rsvps.json)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: Modern CSS with variables and responsive design

## Installation

### 1. Clone/Navigate to Project

```bash
cd event-invite-website
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment (Optional)

You can customize admin credentials by editing `server.js`:

```javascript
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "1234";
```

### 4. Start the Server

```bash
npm start
# or
node server.js
```

The server will start at `http://localhost:3000`

## Data Storage

All RSVP data is stored in `data/rsvps.json`. This file is automatically created and updated when guests submit RSVPs.

## API Endpoints

### Public Endpoints

- **POST** `/api/rsvp` - Submit RSVP
  ```json
  {
    "name": "John Doe",
    "guests": 2,
    "attend": "Yes",
    "message": "Looking forward to it!"
  }
  ```

- **POST** `/api/login` - Admin login
  ```json
  {
    "username": "admin",
    "password": "1234"
  }
  ```

### Admin Endpoints

- **GET** `/api/rsvps` - Fetch all RSVPs
  - Returns list of all RSVPs with stats

### Utility Endpoints

- **GET** `/api/health` - Server health check
  - Shows server status and storage type

## Project Structure

```
event-invite-website/
├── public/
│   ├── index.html          # Main landing page
│   ├── dashboard.html      # Admin dashboard
│   ├── css/
│   │   └── style.css       # Styling
│   └── js/
│       ├── main.js         # Landing page logic
│       └── dashboard.js    # Dashboard logic
├── data/
│   └── rsvps.json         # JSON storage
├── server.js              # Express server
├── package.json           # Dependencies
└── BRAND_GUIDE.md         # Brand identity guide
```

## Credentials

Default admin credentials (change in `server.js` for production):
- **Username**: admin
- **Password**: 1234

## Testing

1. **Visit landing page**: http://localhost:3000
2. **Submit RSVP** with your details
3. **Admin login** with credentials above
4. **View dashboard** to see submitted RSVPs

## Features in Detail

### Landing Page
- Professional navbar with event branding
- Hero section with admin login panel on the side
- Event details cards
- Live countdown timer
- RSVP submission form
- Responsive design for all devices

### Admin Dashboard
- Secure login gateway
- Real-time RSVP statistics
- Sortable RSVP table
- Quick view of guest details
- Refresh data button
- Logout functionality

## Environment Variables

No environment variables required. All configuration is in `server.js`:

| Variable | Default | Location |
|----------|---------|----------|
| PORT | 3000 | server.js line 6 |
| ADMIN_USERNAME | admin | server.js line 9 |
| ADMIN_PASSWORD | 1234 | server.js line 10 |

## Security Notes

⚠️ **For Production:**
- Change default admin credentials in `server.js`
- Use HTTPS
- Add rate limiting
- Validate all inputs
- Set up automated backups of `data/rsvps.json`

## Troubleshooting

### Port Already in Use
```bash
# Find and kill process on port 3000
Get-Process | Where-Object {$_.Id -eq (Get-NetTCPConnection -LocalPort 3000).OwningProcess} | Stop-Process
```

### RSVP Form Not Submitting
- Check browser console for errors
- Verify server is running on port 3000
- Ensure /api/rsvp endpoint is accessible
- Check that `data/rsvps.json` file is writable

## Support

For issues or questions, check the code comments in `server.js` and review the API endpoint documentation above.

## License

MIT License
