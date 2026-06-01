// Central mutable mock state. All api.js functions read/write from here.
// When connecting to the real backend, replace api.js functions — not this file.

export const mockState = {
  students: [
    { studentId: 1, name: "Alice Chen",    email: "alice.chen.25@dartmouth.edu",    accountBalance: 455.00, yearStanding: "junior",    major: "Computer Science" },
    { studentId: 2, name: "Bob Martinez",  email: "bob.martinez.26@dartmouth.edu",  accountBalance: 330.00, yearStanding: "sophomore",  major: "Economics" },
    { studentId: 3, name: "Carol Kim",     email: "carol.kim.25@dartmouth.edu",     accountBalance: 750.00, yearStanding: "senior",     major: "Government" },
    { studentId: 4, name: "David Park",    email: "david.park.27@dartmouth.edu",    accountBalance: 115.00, yearStanding: "freshman",   major: "Biology" },
  ],

  departments: [
    { departmentId: 1, name: "Computer Science", code: "COSC" },
    { departmentId: 2, name: "Economics",         code: "ECON" },
    { departmentId: 3, name: "Mathematics",       code: "MATH" },
    { departmentId: 4, name: "English",           code: "ENGL" },
    { departmentId: 5, name: "Government",        code: "GOV"  },
    { departmentId: 6, name: "Biology",           code: "BIOL" },
  ],

  distributives: [
    { distributiveId: 1, name: "Quantitative Data Science", code: "QDS"   },
    { distributiveId: 2, name: "Social Analysis",           code: "SOC"   },
    { distributiveId: 3, name: "Literature & Arts",         code: "ART"   },
    { distributiveId: 4, name: "Science",                   code: "SCI"   },
    { distributiveId: 5, name: "Writing",                   code: "WCult" },
  ],

  sections: [
    { sectionId: 1, courseCode: "COSC 50",  title: "Software Design and Implementation",   departmentId: 1, dept: "Computer Science", deptCode: "COSC", distributive: "QDS",   professor: "Prof. Pierson",  term: "Spring 2026", meetingTime: "MWF 10:10–11:15",  location: "Kemeny 008",          enrollmentCap: 40, currentEnrollment: 40 },
    { sectionId: 2, courseCode: "ECON 26",  title: "The Economics of Financial Markets",   departmentId: 2, dept: "Economics",        deptCode: "ECON", distributive: "SOC",   professor: "Prof. Samwick",  term: "Spring 2026", meetingTime: "TTh 10:10–12:00",  location: "Rockefeller 003",     enrollmentCap: 30, currentEnrollment: 30 },
    { sectionId: 3, courseCode: "MATH 22",  title: "Linear Algebra",                       departmentId: 3, dept: "Mathematics",      deptCode: "MATH", distributive: "QDS",   professor: "Prof. Webb",     term: "Spring 2026", meetingTime: "MWF 11:30–12:35",  location: "Kemeny 006",          enrollmentCap: 35, currentEnrollment: 34 },
    { sectionId: 4, courseCode: "ENGL 5",   title: "Writing and Rhetoric",                 departmentId: 4, dept: "English",          deptCode: "ENGL", distributive: "WCult", professor: "Prof. Williams", term: "Spring 2026", meetingTime: "TTh 2:25–4:15",    location: "Dartmouth Hall 105",  enrollmentCap: 20, currentEnrollment: 18 },
    { sectionId: 5, courseCode: "GOV 6",    title: "Understanding Politics",               departmentId: 5, dept: "Government",       deptCode: "GOV",  distributive: "SOC",   professor: "Prof. Herron",   term: "Spring 2026", meetingTime: "MWF 8:50–9:55",    location: "Silsby 213",          enrollmentCap: 50, currentEnrollment: 45 },
    { sectionId: 6, courseCode: "BIOL 12",  title: "Cell Biology and Genetics",            departmentId: 6, dept: "Biology",          deptCode: "BIOL", distributive: "SCI",   professor: "Prof. Bhatt",    term: "Spring 2026", meetingTime: "TTh 11:30–1:20",   location: "Life Sciences 200",   enrollmentCap: 60, currentEnrollment: 55 },
  ],

  // Price history per sectionId — append-only, chronological
  priceHistory: {
    1: [
      { price: 20.00, recordedAt: "2024-09-15", label: "Sep '24" },
      { price: 30.00, recordedAt: "2024-11-20", label: "Nov '24" },
      { price: 25.00, recordedAt: "2025-01-12", label: "Jan '25" },
      { price: 45.00, recordedAt: "2025-03-08", label: "Mar '25" },
      { price: 40.00, recordedAt: "2025-05-20", label: "May '25" },
      { price: 60.00, recordedAt: "2025-09-18", label: "Sep '25" },
      { price: 75.00, recordedAt: "2025-11-14", label: "Nov '25" },
    ],
    2: [
      { price: 15.00, recordedAt: "2024-09-20", label: "Sep '24" },
      { price: 20.00, recordedAt: "2025-01-15", label: "Jan '25" },
      { price: 30.00, recordedAt: "2025-05-22", label: "May '25" },
      { price: 28.00, recordedAt: "2025-09-25", label: "Sep '25" },
    ],
    3: [
      { price: 10.00, recordedAt: "2024-09-18", label: "Sep '24" },
      { price: 15.00, recordedAt: "2025-01-10", label: "Jan '25" },
      { price: 12.00, recordedAt: "2025-05-18", label: "May '25" },
      { price: 18.00, recordedAt: "2025-09-22", label: "Sep '25" },
    ],
    4: [
      { price: 5.00,  recordedAt: "2024-09-15", label: "Sep '24" },
      { price: 8.00,  recordedAt: "2025-01-12", label: "Jan '25" },
      { price: 6.00,  recordedAt: "2025-05-15", label: "May '25" },
    ],
    5: [
      { price: 10.00, recordedAt: "2024-09-20", label: "Sep '24" },
      { price: 12.00, recordedAt: "2025-01-18", label: "Jan '25" },
      { price: 18.00, recordedAt: "2025-05-20", label: "May '25" },
      { price: 22.00, recordedAt: "2025-09-24", label: "Sep '25" },
    ],
    6: [
      { price: 8.00,  recordedAt: "2024-09-22", label: "Sep '24" },
      { price: 10.00, recordedAt: "2025-01-20", label: "Jan '25" },
      { price: 12.00, recordedAt: "2025-05-25", label: "May '25" },
    ],
  },

  // Active listings + their bids
  // Seller anonymity enforced in api.js — buyerId/sellerId stripped from public responses
  listings: [
    {
      listingId: 1,
      sellerId: 1,      // Alice selling COSC 50
      sectionId: 1,
      minPrice: 30.00,
      status: "active",
      createdAt: "2026-05-25T10:00:00",
      expiresAt: "2026-05-30T23:59:00",
      bids: [
        { bidId: 1, buyerId: 2, amount: 55.00, status: "outbid",  createdAt: "2026-05-25T11:00:00" },
        { bidId: 2, buyerId: 3, amount: 70.00, status: "outbid",  createdAt: "2026-05-26T09:00:00" },
        { bidId: 3, buyerId: 4, amount: 85.00, status: "pending", createdAt: "2026-05-27T14:00:00" },
      ],
    },
    {
      listingId: 2,
      sellerId: 3,      // Carol selling ECON 26
      sectionId: 2,
      minPrice: 20.00,
      status: "active",
      createdAt: "2026-05-26T08:00:00",
      expiresAt: "2026-05-30T23:59:00",
      bids: [
        { bidId: 4, buyerId: 1, amount: 45.00, status: "pending", createdAt: "2026-05-27T10:00:00" },
      ],
    },
    {
      listingId: 3,
      sellerId: 4,      // David selling MATH 22
      sectionId: 3,
      minPrice: 15.00,
      status: "active",
      createdAt: "2026-05-27T12:00:00",
      expiresAt: "2026-05-30T23:59:00",
      bids: [
        { bidId: 5, buyerId: 2, amount: 20.00, status: "pending", createdAt: "2026-05-28T09:00:00" },
      ],
    },
  ],

  // Enrollments: studentId → [sectionId]
  enrollments: {
    1: [1, 4, 5],   // Alice:  COSC 50, ENGL 5, GOV 6
    2: [2, 6, 5],   // Bob:    ECON 26, BIOL 12, GOV 6
    3: [2, 3, 5],   // Carol:  ECON 26, MATH 22, GOV 6
    4: [3, 4, 6],   // David:  MATH 22, ENGL 5, BIOL 12
  },

  // Completed transactions (historical)
  transactions: [
    { transactionId: 1, buyerId: 2, sellerId: 99, sectionId: 1, finalPrice: 75.00, createdAt: "2025-11-14T15:00:00" },
    { transactionId: 2, buyerId: 3, sellerId: 98, sectionId: 2, finalPrice: 28.00, createdAt: "2025-09-25T11:00:00" },
    { transactionId: 3, buyerId: 99,sellerId: 1,  sectionId: 4, finalPrice: 6.00,  createdAt: "2025-05-15T09:00:00" },
  ],

  // Notifications: studentId → [notification]
  notifications: {
    1: [
      { notificationId: 1, type: "bid_received", payload: { amount: 85.00, courseCode: "COSC 50",  title: "Software Design and Implementation"   }, isRead: false, createdAt: "2026-05-27T14:05:00" },
      { notificationId: 2, type: "bid_received", payload: { amount: 70.00, courseCode: "COSC 50",  title: "Software Design and Implementation"   }, isRead: true,  createdAt: "2026-05-26T09:05:00" },
    ],
    2: [
      { notificationId: 3, type: "outbid",       payload: { amount: 70.00, courseCode: "COSC 50",  title: "Software Design and Implementation"   }, isRead: false, createdAt: "2026-05-26T09:06:00" },
    ],
    3: [
      { notificationId: 4, type: "bid_received", payload: { amount: 45.00, courseCode: "ECON 26",  title: "The Economics of Financial Markets"    }, isRead: false, createdAt: "2026-05-27T10:05:00" },
      { notificationId: 5, type: "outbid",       payload: { amount: 85.00, courseCode: "COSC 50",  title: "Software Design and Implementation"   }, isRead: false, createdAt: "2026-05-27T14:06:00" },
    ],
    4: [
      { notificationId: 6, type: "bid_received", payload: { amount: 20.00, courseCode: "MATH 22",  title: "Linear Algebra"                       }, isRead: false, createdAt: "2026-05-28T09:05:00" },
    ],
  },

  // Ticker data — recent price movements across sections
  ticker: [
    { sectionId: 1, courseCode: "COSC 50",  currentBid: 85.00, lastSale: 75.00, change: +10.00 },
    { sectionId: 2, courseCode: "ECON 26",  currentBid: 45.00, lastSale: 28.00, change: +17.00 },
    { sectionId: 3, courseCode: "MATH 22",  currentBid: 20.00, lastSale: 18.00, change: +2.00  },
    { sectionId: 5, courseCode: "GOV 6",    currentBid: null,  lastSale: 22.00, change: 0      },
    { sectionId: 6, courseCode: "BIOL 12",  currentBid: null,  lastSale: 12.00, change: 0      },
  ],
};

// ── Helpers ──────────────────────────────────────────────────────────────────

export function getSectionById(id) {
  return mockState.sections.find(s => s.sectionId === id);
}

export function getListingBySectionId(sectionId) {
  return mockState.listings.find(l => l.sectionId === sectionId && l.status === "active") || null;
}

export function getHighestBid(listing) {
  const active = listing.bids.filter(b => b.status === "pending");
  if (!active.length) return null;
  return active.reduce((max, b) => (b.amount > max.amount ? b : max), active[0]);
}

export function nextId(arr) {
  return arr.length ? Math.max(...arr.map(x => x[Object.keys(x)[0]])) + 1 : 1;
}
