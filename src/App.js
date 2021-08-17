import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Cart from './components/cart/Cart';
import Cats from './components/cats/Cats';
import Footer from './components/footer/Footer';
import Header from './components/header/Header';
import Spinner from './components/spinner/Spinner';
import auth from './firebase';
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
  let [user, loading] = useAuthState(auth);
  return (
    <div className="App">
      {!user || loading 
      ? <Spinner /> 
      : <Router>
          <Header />
          <div className="d-flex flex-column">
            <div className="d-flex flex-row">

              <Cats />

              <Switch>

                <Route exact path="/">
                  <Home />
                </Route>

                <Route path="/rolls">
                  <Rolls />
                </Route>

                <Route path="/sushi">
                  <Sushi />
                </Route>

                <Route path="/sets">
                  <Sets />
                </Route>

                <Route path="/snacks">
                  <Snacks />
                </Route>

                <Route path="/drinks">
                  <Drinks />
                </Route>

                <Route path="/sauces">
                  <Sauces />
                </Route>

                <Route path="/favorites">
                  <Favorites />
                </Route>

                <Route path="/menu">
                  <Menu />
                </Route>

              </Switch>

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
