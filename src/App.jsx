import React, { useEffect, useMemo } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDispatch, useSelector } from "react-redux";
import { getRedirectResult } from "firebase/auth";
import { login, logout, fetchUserRole } from "./features/user/userSlice";
import {
  selectIsCheckout,
  toggleCheckout,
} from "./features/checkout/checkoutSlice";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useLocation } from "react-router-dom";
import Cart from "./components/cart/Cart";
import Cats from "./components/cats/Cats";
import Footer from "./components/footer/Footer";
import Header from "./components/header/Header";
import Spinner from "./components/spinner/Spinner";
import { auth } from "./firebase";
import Drinks from "./pages/drinks/Drinks";
import Favorites from "./pages/favorites/Favorites";
import Home from "./pages/home/Home";
import Menu from "./pages/menu/Menu";
import Rolls from "./pages/rolls/Rolls";
import Sauces from "./pages/sauces/Sauces";
import Sets from "./pages/sets/Sets";
import Snacks from "./pages/snacks/Snacks";
import Sushi from "./pages/sushi/Sushi";
import { Checkout } from "./components/checkout/Checkout";
import Orders from "./pages/account/Orders";
import Addresses from "./pages/account/Addresses";
import ProductDetail from "./pages/product/ProductDetail";
import AdminProducts from "./pages/admin/AdminProducts";

function App() {
  const [, loading] = useAuthState(auth);
  const dispatch = useDispatch();
  const isCheckout = useSelector(selectIsCheckout);
  const location = useLocation();
  const demoMode = useMemo(() => {
    const sp = new URLSearchParams(location.search);
    const isOn =
      sp.get("demo") === "1" || localStorage.getItem("demoMode") === "1";
    if (isOn) {
      localStorage.setItem("demoMode", "1");
    }
    return isOn;
  }, [location.search]);

  useEffect(() => {
    if (demoMode) {
      localStorage.setItem("demoMode", "1");
      dispatch(
        login({
          uid: "demo",
          email: "hr@demo.example",
          displayName: "Admin Demo",
          role: "admin",
        })
      );
      // Убедимся, что UI обновится в течение этого цикла
      return () => {};
    }

    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          dispatch(
            login({
              uid: result.user.uid,
              email: result.user.email,
              displayName: result.user.displayName,
            })
          );
          dispatch(fetchUserRole(result.user.uid));
        }
      })
      .catch((error) => console.error("Login redirect error:", error));

    const unsubscribe = auth.onAuthStateChanged((userAuth) => {
      if (userAuth) {
        dispatch(
          login({
            uid: userAuth.uid,
            email: userAuth.email,
            displayName: userAuth.displayName,
          })
        );
        dispatch(fetchUserRole(userAuth.uid));
      } else {
        dispatch(logout());
      }
    });

    return unsubscribe;
  }, [dispatch, demoMode]);

  // Close checkout overlay when route changes
  useEffect(() => {
    if (isCheckout) {
      dispatch(toggleCheckout(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Close checkout when custom navigation event fired (from nav)
  useEffect(() => {
    const handler = () => dispatch(toggleCheckout(false));
    document.addEventListener("app:navigate", handler);
    return () => document.removeEventListener("app:navigate", handler);
  }, [dispatch]);

  return (
    <div className="App flex flex-col">
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Header />
          {isCheckout ? (
            <Checkout />
          ) : (
            <div className="d-flex flex-column main-content">
              <div className="d-flex flex-row">
                <Cats />

                <Routes>
                  <Route path="/" element={<Navigate to="/shop" />} />
                  <Route path="/shop" element={<Home />} />
                  <Route
                    path="/account"
                    element={<Navigate to="/account/orders" />}
                  />
                  <Route path="/rolls" element={<Rolls />} />
                  <Route path="/sushi" element={<Sushi />} />
                  <Route path="/sets" element={<Sets />} />
                  <Route path="/snacks" element={<Snacks />} />
                  <Route path="/drinks" element={<Drinks />} />
                  <Route path="/sauces" element={<Sauces />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/menu" element={<Menu />} />
                  <Route path="/account/orders" element={<Orders />} />
                  <Route path="/account/addresses" element={<Addresses />} />
                  <Route
                    path="/product/:collection/:id"
                    element={<ProductDetail />}
                  />
                  <Route path="/admin/products" element={<AdminProducts />} />
                </Routes>

                <Cart />
              </div>
              <Footer />
            </div>
          )}
        </>
      )}

      {/* Footer */}
    </div>
  );
}

export default App;
