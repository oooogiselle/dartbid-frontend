import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/shared/Navbar";
import TickerBanner from "./components/shared/TickerBanner";
import HomePage from "./pages/HomePage";
import StockPage from "./pages/StockPage";
import DashboardPage from "./pages/DashboardPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="page-layout">
        <Navbar />
        <TickerBanner />
        <Routes>
          <Route path="/"                  element={<HomePage />} />
          <Route path="/class/:sectionId"  element={<StockPage />} />
          <Route path="/dashboard"         element={<DashboardPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
