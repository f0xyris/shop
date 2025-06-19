import React, { useEffect, useState } from "react";
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
import { IoMdClose } from "react-icons/io";
import { toggleCart } from "../../features/cart/cartSlice";

function Header() {
  const [isActive, setIsActive] = useState(false);
  const userActive = useSelector(selectUser);
  const [user] = useAuthState(auth);
  const history = useNavigate();
  const dispatch = useDispatch();

  const onActiveChange = () => {
    setIsActive((prev) => !prev);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 767) {
        setIsActive(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const signIn = () => {
    if (userActive) {
      dispatch(logout());
      signOut(auth);
    } else {
      signInWithPopup(auth, provider).catch((error) => alert(error.message));
    }
  };

  return (
    <header className="header container-fluid px-[.6rem]">
      <span className="w-[3rem] h-full lg:w-[14rem]">
        <img
          onClick={() => history("/")}
          className="header__logo object-none object-left"
          src={logo}
          alt="logo"
        />
      </span>
      <div
        className={`hidden md:flex ${
          isActive
            ? "w-full bg-amber-700 text-white absolute left-16 right-0 bottom-[22rem] top-[4.2rem] min-h-screen fade-slide-in"
            : "fade-slide-out"
        }`}
      >
        <Nav onActiveChange={onActiveChange} />
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
          <FaCartArrowDown
            className="size-6.5 fill-[rgb(238_99_68)]"
            onClick={() => dispatch(toggleCart())}
          />
        </div>
        <div className="md:hidden z-10">
          {isActive ? (
            <IoMdClose
              className="size-6.5 fill-[rgb(238_99_68)]"
              onClick={() => onActiveChange()}
            />
          ) : (
            <GiHamburgerMenu
              className="size-6.5 fill-[rgb(238_99_68)]"
              onClick={() => onActiveChange()}
            />
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
