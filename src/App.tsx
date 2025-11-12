import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import PrivacyPage from "./pages/PrivacyPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import BookingManagerPage from "./pages/BookingManagerPage";
import BookingPage from "./pages/BookingPage";
import CreateUserPage from "./pages/CreateUserPage";
import BaseLayout from "./components/BaseLayout";
import BookingResourceConfigPage from './pages/BookingResourceConfigPage';
import AccountSettingsPage from './pages/AccountSettingsPage';
import WebshopPage from './pages/WebshopPage';

console.log('API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);

function App() {
  return (
    <Router>
      <BaseLayout>
        <Routes>
          <Route path="/" element={<Homepage />} />         {/* Homepage */}
          <Route path="/about" element={<AboutPage />} />   {/* About Us */}
          <Route path="/privacy" element={<PrivacyPage />} /> {/* Privacy */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/create-user" element={<CreateUserPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/bookings" element={<BookingManagerPage />} />
          <Route path="/webshop" element={<WebshopPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/dashboard/bookings/configure/:id" element={<BookingResourceConfigPage />} />
          <Route path="/account/settings" element={<AccountSettingsPage />} />
        </Routes>
      </BaseLayout>
    </Router>
  );
}

export default App;
