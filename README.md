# DartBid — Frontend

A course marketplace for Dartmouth students. Students can list their enrollment spots for sale, place bids on listings, and enroll in open sections — all through a stock-market-style interface.

CS61, Spring 2026.  
**Team:** Caroline Chung, Giselle Wu, Eva Tate, Helen Cui

---

## Tech Stack

| | |
|---|---|
| Framework | React 19 + Vite |
| Routing | React Router v7 |
| HTTP | Axios |
| Charts | Recharts |
| Backend | Flask + MySQL (deployed on Render) |

---

## Getting Started

### Prerequisites
- Node.js 18+
- The Flask backend running (locally or via the deployed Render URL)

### Install dependencies
```bash
npm install
```

### Environment variable
Create a `.env.local` file in the project root:
```
VITE_API_URL=https://dartbid.onrender.com/api
```
If this is not set, the dev server proxies `/api` requests to `https://dartbid.onrender.com` automatically (see `vite.config.js`).

### Run the dev server
```bash
npm run dev
```

### Build for production
```bash
npm run build
```
The output goes to `dist/`. The `public/_redirects` file is included in the build, which tells Render's static site host to serve `index.html` for all routes (required for React Router to work on direct navigation/refresh).

---

## Demo Accounts

All accounts use password `password123`.

| Email | Name | Role highlights |
|---|---|---|
| alice@dartmouth.edu | Alice Mercer | Selling COSC 61 (4 bids) |
| george@dartmouth.edu | George Addo | Selling COSC 74 (3 bids) |
| bob@dartmouth.edu | Bob Tanaka | Selling MATH 22, bidding on COSC 89 |
| julia@dartmouth.edu | Julia Santos | Selling ECON 21, highest bid on COSC 61 |
| diana@dartmouth.edu | Diana Park | Selling COSC 89 (rare small section) |
| carol@dartmouth.edu | Carol Osei | Bidding actively across listings |
| evan@dartmouth.edu | Evan Walsh | Fresh account, no listings |

---

## Project Structure

```
src/
├── api.js                  # All backend calls (single axios instance + interceptors)
├── main.jsx                # App entry point
├── App.jsx                 # Routes + auth guards
├── context/
│   └── UserContext.jsx     # Auth state, JWT management, notification badge
├── pages/
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── HomePage.jsx        # Listings browser + All Classes (with enroll)
│   ├── DashboardPage.jsx   # Seller/buyer dashboard with tabs
│   └── StockPage.jsx       # Individual course page with price chart + bid form
└── components/
    ├── shared/
    │   ├── Navbar.jsx
    │   ├── TickerBanner.jsx         # Scrolling price ticker
    │   ├── NotificationDrawer.jsx
    │   ├── DepositModal.jsx
    │   └── CreateListingModal.jsx
    ├── dashboard/
    │   └── DashComponents.jsx       # AccountSummary, ActiveListings, BidsReceived,
    │                                #   BidsPlaced, EnrollmentsTab, TransactionHistory
    ├── home/
    │   ├── FilterBar.jsx
    │   ├── ListingCard.jsx
    │   └── ListingGrid.jsx
    └── stock/
        ├── BidForm.jsx
        ├── PriceChart.jsx
        └── StockComponents.jsx
```

---

## How the Frontend Connects to the Backend

All API calls go through `src/api.js`, which creates a single axios instance pointed at `VITE_API_URL`. A request interceptor automatically attaches the JWT token as `Authorization: Bearer <token>` on every request. A response interceptor unwraps Flask's `{ data: ... }` envelope and coerces MySQL decimal strings to floats.

**Auth flow:**
1. Login → `POST /api/auth/login` → JWT token stored in `localStorage`
2. On page reload → token restored from `localStorage` → `GET /api/students/me` re-hydrates the session
3. Logout → clears `localStorage` and the in-memory token

---

## Key Features

- **Listings browser** — filter by department, distributive, price range; sort by bid activity
- **All Classes view** — browse every section with live enrollment counts; enroll directly (max 3)
- **Stock-style course page** — price history chart, live bid table, one-click bidding
- **Seller dashboard** — create listings, review incoming bids, accept the best offer
- **Buyer dashboard** — track active bids, see outbid alerts
- **Notifications** — inbox for bid received, outbid, accepted, and payout events
- **Deposit** — add funds to your account balance from anywhere in the app
