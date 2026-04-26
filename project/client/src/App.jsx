import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import SignUp from "./pages/SignUp";
import Buy from "./pages/Buy";
import Sell from "./pages/Sell";
import Rent from "./pages/Rent";
import Notification from "./pages/Notification";
import AddProduct from "./pages/AddProduct";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import ProductDetails from "./pages/ProductDetails";
import Footer from "./components/Footer";
import CollectionPage from "./pages/CollectionPage";
import Search from "./pages/Search";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <div className="app-ambient app-ambient-one" />
        <div className="app-ambient app-ambient-two" />
        <div className="app-ambient app-ambient-three" />
        <Navbar />
        <main className="relative z-[1] flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/buy" element={<Buy />} />
            <Route path="/sell" element={<Sell />} />
            <Route path="/rent" element={<Rent />} />
            <Route path="/search" element={<Search />} />
            <Route path="/collections/:categorySlug" element={<CollectionPage />} />
            <Route path="/notifications" element={<Notification />} />
            <Route path="/login" element={<Signin />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route
              path="/add"
              element={
                <ProtectedRoute>
                  <AddProduct />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
