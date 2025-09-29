import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductList from "./components/ProductList";
import Checkout from "./pages/Checkout";
import Homepage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import PrivacyPage from "./pages/PrivacyPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import BookingPage from "./pages/BookingPage";
import CreateUserPage from "./pages/CreateUserPage";
import ProductPage from "./pages/ProductPage";
import Product from "./pages/Product";
import BaseLayout from "./components/BaseLayout";

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
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/products" element={<Product />} />
          <Route path="/product-list" element={<ProductList />} />
          <Route path="/product/checkout" element={<Checkout cart={[]} onSubmit={() => {}} />} />
        </Routes>
      </BaseLayout>
    </Router>
  );
}

export default App;
