import React, { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDispatch } from 'react-redux';
import { getRedirectResult } from 'firebase/auth';
import { login, logout } from './features/user/userSlice';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Cart from './components/cart/Cart';
import Cats from './components/cats/Cats';
import Footer from './components/footer/Footer';
import Header from './components/header/Header';
import Spinner from './components/spinner/Spinner';
import { auth } from './firebase';
import Drinks from './pages/drinks/Drinks';
import Favorites from './pages/favorites/Favorites';
import Home from './pages/home/Home';
import Menu from './pages/menu/Menu';
import Rolls from './pages/rolls/Rolls';
import Sauces from './pages/sauces/Sauces';
import Sets from './pages/sets/Sets';
import Snacks from './pages/snacks/Snacks';
import Sushi from './pages/sushi/Sushi';


function App() {
  const [, loading] = useAuthState(auth);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("🔥 useEffect: start");
    getRedirectResult(auth)
      .then((result) => {
        console.log("🚀 getRedirectResult result:", result);
        if (result?.user) {
          console.log("✅ USER FROM REDIRECT:", result.user);
          dispatch(login({
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName
          }));
        }
      })
      .catch((error) => console.error("Login redirect error:", error));

    const unsubscribe = auth.onAuthStateChanged((userAuth) => {
      console.log("👀 onAuthStateChanged user:", userAuth);
      if (userAuth) {
        dispatch(login({
          uid: userAuth.uid,
          email: userAuth.email,
          displayName: userAuth.displayName
        }));
      } else {
        dispatch(logout());
      }
    });

    return unsubscribe;
  }, [dispatch]);

  return (
    <div className="App">
      {loading 
      ? <Spinner /> 
      : <Router>
          <Header />
          <div className="d-flex flex-column main-content">
            <div className="d-flex flex-row">

              <Cats />

              <Routes>

                <Route path="/" element={<Home />} />
                <Route path="/rolls" element={<Rolls />} />
                <Route path="/sushi" element={<Sushi />} />
                <Route path="/sets" element={<Sets />} />
                <Route path="/snacks" element={<Snacks />} />
                <Route path="/drinks" element={<Drinks />} />
                <Route path="/sauces" element={<Sauces />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/menu" element={<Menu />} />

              </Routes>

              <Cart />

            </div>
            <Footer />
          </div>
        </Router>
      }
      
      {/* Footer */}

    </div>
  );
}

export default App;
