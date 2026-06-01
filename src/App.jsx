import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useUser } from "./context/UserContext";
import Navbar from "./components/shared/Navbar";
import TickerBanner from "./components/shared/TickerBanner";
import HomePage from "./pages/HomePage";
import StockPage from "./pages/StockPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function ProtectedRoute({ children }) {
  const { currentUser, authLoading } = useUser();
  if (authLoading) return null;
  if (!currentUser) return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { currentUser, authLoading } = useUser();
  if (authLoading) return null;
  if (currentUser) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="page-layout">
        <Navbar />
        <TickerBanner />
        <Routes>
          <Route path="/login"             element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register"          element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route path="/"                  element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/class/:sectionId"  element={<ProtectedRoute><StockPage /></ProtectedRoute>} />
          <Route path="/dashboard"         element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
