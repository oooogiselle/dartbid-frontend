/**
 * api.js — Real Flask backend. All calls hit http://localhost:8080/api/
 *
 * Auth: JWT Bearer token, obtained by logging in each hardcoded student.
 * Token is injected via axios interceptor on every request.
 *
 * Response normalization: Flask + MySQL dictionary cursor returns camelCase
 * column names (matching the schema). Normalize functions below handle any
 * shape differences between what Flask returns and what components expect.
 */

import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL ?? "/api";

export const api = axios.create({ baseURL: BASE_URL });

// ── Token management ─────────────────────────────────────────────────────────

let _token = null;

api.interceptors.request.use((config) => {
  if (_token) config.headers["Authorization"] = `Bearer ${_token}`;
  return config;
});

// mysql-connector-python returns DECIMAL columns as strings.
// Recursively coerce "NNN.NN" strings to floats so .toFixed() works everywhere.
function coerceDecimals(val) {
  if (val === null || val === undefined) return val;
  if (Array.isArray(val)) return val.map(coerceDecimals);
  if (typeof val === "object") {
    return Object.fromEntries(Object.entries(val).map(([k, v]) => [k, coerceDecimals(v)]));
  }
  if (typeof val === "string" && /^-?\d+\.\d+$/.test(val)) return parseFloat(val);
  return val;
}

// Flask wraps all success responses in { data: ..., message: ... }.
// Unwrap envelope and coerce decimal strings in one pass.
api.interceptors.response.use((response) => {
  if (response.data && typeof response.data === "object" && "data" in response.data) {
    response.data = coerceDecimals(response.data.data);
  }
  return response;
});

export function setToken(token) {
  _token = token;
}

// ── Response normalizers ──────────────────────────────────────────────────────
// Maps Flask response shapes → what components expect.
// If Eva's routes already return these shapes exactly, these are no-ops.

function normalizeListing(l) {
  // Flask may embed section as a nested object or as flat joined fields.
  // Handle both.
  const section = l.section ?? {
    sectionId:   l.sectionId,
    courseCode:  l.courseCode,
    title:       l.title,
    dept:        l.department,
    deptCode:    l.departmentCode ?? l.deptCode,
    distributive:l.distributive,
    professor:   l.professor,
    meetingTime: l.meetingTime,
    location:    l.location,
    enrollmentCap:    l.enrollmentCap,
    currentEnrollment:l.currentEnrollment,
  };

  return {
    ...l,
    section,
    // Flask returns highest bid and bid count joined, or compute from bids array
    currentHighestBid: l.currentHighestBid ?? l.highestBid ?? null,
    bidCount:          l.bidCount ?? (l.bids?.length ?? 0),
    minNextBid:        l.minNextBid ?? (
      l.currentHighestBid
        ? parseFloat((parseFloat(l.currentHighestBid) + 0.01).toFixed(2))
        : l.minPrice
    ),
    bids: (l.bids ?? []).map(normalizeBid),
  };
}

function normalizeBid(b) {
  return {
    ...b,
    status: b.status ?? "pending",
    section: b.section ?? {
      sectionId:  b.sectionId,
      courseCode: b.courseCode,
      title:      b.title,
    },
    listing: b.listing ? normalizeListing(b.listing) : null,
  };
}

function normalizeSection(s) {
  return {
    ...s,
    // Flatten dept/distributive if returned as nested objects
    dept:        s.dept ?? s.department?.name ?? s.departmentName,
    deptCode:    s.deptCode ?? s.department?.code ?? s.departmentCode,
    distributive:s.distributive ?? s.distributive?.code ?? s.distributiveCode,
    activeListing: s.activeListing ? normalizeListing(s.activeListing) : null,
    priceHistory:  (s.priceHistory ?? []).map(h => ({
      ...h,
      label: h.label ?? new Date(h.recordedAt).toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
    })),
  };
}

function normalizeTransaction(t) {
  return {
    ...t,
    section: t.section ?? { sectionId: t.sectionId, courseCode: t.courseCode, title: t.title },
    role:    t.role ?? (t.buyerId === t._currentUserId ? "bought" : "sold"),
    finalPrice: t.finalPrice ?? t.final_price,
  };
}

// ── Auth ──────────────────────────────────────────────────────────────────────

// POST /api/auth/register
export async function register({ name, email, password, yearStanding, major }) {
  const res = await api.post("/auth/register", { name, email, password, yearStanding, major });
  return res.data; // { token, student? }
}

// POST /api/auth/login
export async function login(email, password) {
  const res = await api.post("/auth/login", { email, password });
  // Returns { token } — then call getMe() to get student profile
  return res.data;
}

// ── Account ───────────────────────────────────────────────────────────────────

// GET /api/students/me
export async function getMe() {
  const res = await api.get("/students/me");
  return res.data;
}

// POST /api/students/me/deposit  { amount }
export async function deposit(amount) {
  const res = await api.post("/students/me/deposit", { amount });
  return res.data; // { accountBalance }
}

// GET /api/students/me/transactions
export async function getMyTransactions() {
  const res = await api.get("/students/me/transactions");
  return (res.data ?? []).map(normalizeTransaction);
}

// GET /api/students/me/account-history
export async function getAccountHistory() {
  const res = await api.get("/students/me/account-history");
  return res.data ?? [];
}

// ── Enrollments ───────────────────────────────────────────────────────────────

// GET /api/students/me/enrollments
export async function getMyEnrollments() {
  const res = await api.get("/students/me/enrollments");
  // Returns list of section objects the student is enrolled in
  return (res.data ?? []).map(normalizeSection);
}

// ── Sections ──────────────────────────────────────────────────────────────────

// GET /api/sections/departments
export async function getSections() {
  const res = await api.get("/sections/");
  return res.data ?? [];
}

export async function getDepartments() {
  const res = await api.get("/sections/departments");
  return res.data ?? [];
}

// GET /api/sections/distributives
export async function getDistributives() {
  const res = await api.get("/sections/distributives");
  return res.data ?? [];
}

// GET /api/sections/<id>
export async function getSection(sectionId) {
  const res = await api.get(`/sections/${sectionId}`);
  return normalizeSection(res.data);
}

// GET /api/sections/ticker
export async function getTicker() {
  const res = await api.get("/sections/ticker");
  return res.data ?? [];
}

// ── Listings ──────────────────────────────────────────────────────────────────

// GET /api/listings/?department=&distributive=&minPrice=&maxPrice=&search=
export async function getListings(filters = {}) {
  // Remove empty string values so Flask doesn't receive blank params
  const params = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== "" && v != null)
  );
  const res = await api.get("/listings/", { params });
  return (res.data ?? []).map(normalizeListing);
}

// POST /api/listings/  { sectionId, minPrice, expiresAt? }
export async function createListing({ sectionId, minPrice, expiresAt }) {
  const res = await api.post("/listings/", { sectionId, minPrice, expiresAt });
  return normalizeListing(res.data);
}

// POST /api/listings/<id>/cancel
export async function cancelListing(listingId) {
  const res = await api.post(`/listings/${listingId}/cancel`);
  return res.data;
}

// GET /api/students/me/listings  (seller dashboard — own listings + bids)
export async function getMyListings() {
  const res = await api.get("/students/me/listings");
  return (res.data ?? []).map(normalizeListing);
}

// ── Bids ──────────────────────────────────────────────────────────────────────

// POST /api/bids/  { listingId, amount }
export async function placeBid({ listingId, amount }) {
  const res = await api.post("/bids/", { listingId, amount });
  return res.data;
}

// POST /api/bids/<id>/accept
export async function acceptBid(bidId) {
  const res = await api.post(`/bids/${bidId}/accept`);
  return res.data;
}

// GET /api/students/me/bids
export async function getMyBids() {
  const res = await api.get("/students/me/bids");
  return (res.data ?? []).map(normalizeBid);
}

// ── Notifications ─────────────────────────────────────────────────────────────

// GET /api/notifications/
export async function getNotifications() {
  const res = await api.get("/notifications/");
  return res.data ?? [];
}

// POST /api/notifications/mark-read
export async function markNotificationsRead() {
  const res = await api.post("/notifications/mark-read");
  return res.data;
}

// ── Unused in real mode (mock only) ──────────────────────────────────────────
export function setCurrentUser() {} // no-op; real auth uses tokens
