# SwiftLink Express — Global Logistics Tracking Platform

A full-stack Node.js/Express application for real-time shipment tracking, admin dashboard management, and logistics operations.

**Live Demo Features:**
- 📦 Public shipment tracking with real-time updates
- 👨‍💼 Admin dashboard for shipment management
- 💬 Interactive chatbot for customer support
- 📱 Fully responsive mobile UI
- 🔐 JWT-based authentication and session management
- 🌐 RESTful API for all operations

---

## 📂 Project Structure

```
swiftlink-express/
├── swiftlink-backend/              # Node.js backend server
│   ├── public/                     # Frontend files (HTML, CSS, JS)
│   │   ├── index.html              # Main homepage and SPA
│   │   ├── app.js                  # Client-side logic
│   │   ├── styles.css              # Styling
│   │   └── admin/                  # Admin dashboard
│   ├── routes/                     # API endpoints
│   │   ├── auth.js                 # Authentication
│   │   ├── tracking.js             # Shipment tracking
│   │   ├── admin.js                # Admin operations
│   │   └── contact.js              # Contact form submissions
│   ├── middleware/                 # Express middleware
│   ├── utils/                      # Utilities (db, seed, etc.)
│   ├── data/                       # Local JSON database
│   ├── package.json
│   ├── server.js                   # Entry point
│   ├── Dockerfile                  # Docker configuration
│   ├── Procfile                    # Deployment config
│   ├── .env.example                # Environment template
│   └── README.md                   # Backend setup guide
├── GITHUB_SETUP.md                 # GitHub push instructions
├── README.md                       # This file
└── .gitignore
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 16+ installed
- npm or yarn

### Installation

```bash
# Navigate to backend folder
cd swiftlink-backend

# Install dependencies
npm install

# Create .env from template
cp .env.example .env

# Start the server
npm start
```

The app will run at `http://localhost:5000`

### Default Admin Credentials
- **Email:** `admin@swiftlink-express.com`
- **Password:** `Admin@2025!`

---

## 📋 Key Features

### Public Pages
- **Home:** Hero section with quick tracking input
- **Services:** Air freight, sea freight, road delivery details
- **Track Shipment:** Real-time tracking lookup
- **About Us:** Company history and operations
- **FAQs:** Common questions and answers
- **Contact Us:** Direct communication channels
- **Chatbot:** AI-powered customer support widget

### Admin Dashboard
- Shipment management (create, edit, delete)
- Travel history tracking
- Contact inquiry management
- User and session management
- Site settings configuration

### API Endpoints
- `POST /api/auth/login` — User authentication
- `GET /api/tracking/number/:id` — Lookup shipment
- `POST /api/contact` — Submit contact form
- `GET/POST/PUT/DELETE /api/admin/*` — Admin operations (authenticated)

---

## 🗄️ Database

**Current:** Local JSON file (`data/db.json`)
- **Pros:** Zero configuration, no external services
- **Cons:** Not suitable for high-traffic production without persistent storage

**For production deployment:**
- Use Render or Railway with persistent disk volumes
- Or migrate to PostgreSQL, MongoDB, or Firebase for true scalability

---

## 🔑 Environment Variables

```env
PORT=5000                                    # Server port
JWT_SECRET=your-secret-key                   # JWT signing key
NODE_ENV=development|production              # Environment
DATA_DIR=/path/to/persistent/storage         # Database location (must be a mounted persistent volume in production)
```

---

## 📦 Deployment

### Option 1: Render (Recommended)
1. Push code to GitHub (see [GITHUB_SETUP.md](./GITHUB_SETUP.md))
2. Create Render Web Service from GitHub repo
3. Set environment variables
4. Mount persistent disk at `/data`
5. Deploy

**Setup Steps:** See `swiftlink-backend/README.md`

### Option 2: Railway
Similar to Render; see `swiftlink-backend/README.md` for details

### Option 3: Docker
```bash
cd swiftlink-backend
docker build -t swiftlink-backend .
docker run -p 5000:5000 -v $(pwd)/data:/data swiftlink-backend
```

---

## 🐙 GitHub & Version Control

1. **First-time setup:** See [GITHUB_SETUP.md](./GITHUB_SETUP.md) for step-by-step GitHub instructions
2. **Push code:**
   ```bash
   git add .
   git commit -m "Your message"
   git push
   ```
3. **Auto-deploy:** Connect to Render/Railway; redeploy happens automatically on push

---

## 🔐 Authentication & Security

- JWT tokens for stateless authentication
- Bcryptjs password hashing
- Rate limiting on sensitive endpoints
- CORS enabled for cross-origin requests
- Helmet.js for HTTP security headers

---

## 📱 Frontend Technologies

- **HTML5** — Semantic markup
- **CSS3 + Tailwind CSS** — Responsive design via CDN
- **GSAP** — Smooth animations
- **Vanilla JavaScript** — SPA routing and interactivity
- **Font Awesome** — Icon library

---

## ⚙️ Backend Technologies

- **Express.js** — HTTP server framework
- **LowDB** — File-based JSON database
- **JWT** — Secure authentication
- **Bcryptjs** — Password hashing
- **UUID** — Unique ID generation
- **dotenv** — Environment configuration

---

## 📝 API Documentation

### Public Endpoints

#### Get Shipment Tracking
```http
GET /api/tracking/number/KCS00346789-CARGO
```

**Response:**
```json
{
  "data": {
    "shipment": { ... },
    "history": [ ... ]
  }
}
```

### Authenticated Endpoints (Admin)

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{ "email": "admin@swiftlink-express.com", "password": "Admin@2025!" }
```

#### Get Shipments (Admin)
```http
GET /api/admin/shipments?page=1&limit=20
Authorization: Bearer <JWT_TOKEN>
```

#### Create Shipment (Admin)
```http
POST /api/admin/shipments
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "trackingNumber": "SL-999-NEW",
  "status": "transit",
  ...
}
```

---

## 🛠️ Troubleshooting

### Server won't start
- Check if port 5000 is already in use
- Verify Node.js is installed: `node --version`
- Check `.env` file exists and is readable

### Tracking lookup returns 404
- Confirm tracking number exists in database
- Default test numbers: `KCS00346789-CARGO`, `SL-505-XYZ`, `SL-101-ABC`

### Admin login fails
- Verify credentials: `admin@swiftlink-express.com` / `Admin@2025!`
- Clear browser localStorage and try again
- Check server logs for errors

---

## 📄 License

This project is provided as-is for educational and commercial use.

---

## 📞 Support

For issues or questions:
- Email: support@swiftlink-express.com
- WhatsApp: +17242916750
- Telegram: [Contact form on homepage]

---

## 🎯 Next Steps

1. **Local testing:** Run `npm start` and test all features
2. **GitHub setup:** Follow [GITHUB_SETUP.md](./GITHUB_SETUP.md)
3. **Deploy:** Connect to Render or Railway
4. **Customize:** Edit content, branding, and admin credentials
5. **Go live:** Point your domain to the deployed service

---

**Built with ❤️ for logistics automation**
