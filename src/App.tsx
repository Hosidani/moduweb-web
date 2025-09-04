import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import PrivacyPage from "./pages/PrivacyPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import BookingPage from "./pages/BookingPage";
import BaseLayout from "./components/BaseLayout";

function App() {
  return (
    <Router>
      <BaseLayout>
        <Routes>
          <Route path="/" element={<Homepage />} />         {/* Homepage */}
          <Route path="/about" element={<AboutPage />} />   {/* About Us */}
          <Route path="/privacy" element={<PrivacyPage />} /> {/* Privacy */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/booking" element={<BookingPage />} />
        </Routes>
      </BaseLayout>
    </Router>
  );
}

export default App;
