import React from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

import logo from "../../images/ninja-logo.svg";
import heart from "../../images/heart.svg";
import people from "../../images/people.svg";
import { useDispatch, useSelector } from "react-redux";
import "./Header.css";
import { logout, selectUser } from "../../features/user/userSlice";
import Nav from "../nav/Nav";
import { auth, provider } from "../../firebase";
import { FaCartArrowDown } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";

function Header() {
  const userActive = useSelector(selectUser);
  const [user] = useAuthState(auth);
  const history = useNavigate();
  const dispatch = useDispatch();

  const signIn = () => {
    if (userActive) {
      dispatch(logout());
      signOut(auth);
    } else {
      signInWithPopup(auth, provider).catch((error) => alert(error.message));
    }
  };

  return (
    <header className="header container-fluid">
      <span className="w-[3rem] h-full lg:w-[14rem]">
        <img
          onClick={() => history("/")}
          className="header__logo object-none object-left"
          src={logo}
          alt="logo"
        />
      </span>
      <div className="hidden md:flex">
        <Nav />
      </div>
      <div className="header__right items-center gap-4">
        <div
          className="header__favorites"
          onClick={() => history("/favorites")}
        >
          <img src={heart} alt="heart" />
          <span className="hidden lg:block">Favorites</span>
        </div>
        <div onClick={signIn} className="header__login">
          <img src={people} alt="people" />
          {userActive ? (
            <span className="hidden lg:block">{user.displayName}</span>
          ) : (
            <span>Log in</span>
          )}
        </div>
        <div className="lg:hidden">
          <FaCartArrowDown className="size-6.5 fill-[rgb(238_99_68)]" />
        </div>
        <div className="md:hidden">
          <GiHamburgerMenu className="size-6.5 fill-[rgb(238_99_68)]" />
        </div>
      </div>
    </header>
  );
}

export default Header;
