import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

import logo from "../../images/ninja-logo.svg";
import { useDispatch, useSelector } from "react-redux";
import "./Header.css";
import {
  logout,
  selectUser,
  selectIsAdmin,
} from "../../features/user/userSlice";
import Nav from "../nav/Nav";
import { auth, provider } from "../../firebase";
import { IoCart } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { MdOutlineLogin } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
import { toggleCart, showCartItems } from "../../features/cart/cartSlice";
import { selectCity, setCity } from "../../features/settings/settingsSlice";

function Header() {
  const [isActive, setIsActive] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const userActive = useSelector(selectUser);
  const isCartEmpty = useSelector(showCartItems);
  const currentCity = useSelector(selectCity);
  const [user] = useAuthState(auth);
  const history = useNavigate();
  const dispatch = useDispatch();
  const isAdmin = useSelector(selectIsAdmin);
  const demoMode = localStorage.getItem("demoMode") === "1";

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
      setIsAccountOpen((prev) => !prev);
    } else {
      if (demoMode) {
        // In demo, user is already auto-logged in via App; just open menu
        setIsAccountOpen(true);
        dispatch(toggleCart(false));
        return;
      }
      signInWithPopup(auth, provider).catch((error) => alert(error.message));
      dispatch(toggleCart(false));
    }
  };

  const changeCity = (e) => {
    dispatch(setCity(e.target.value));
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
            ? "w-full bg-amber-700 text-white absolute left-0 right-0 bottom-[22rem] top-0 min-h-screen fade-slide-in z-1"
            : "fade-slide-out"
        }`}
      >
        <Nav
          onCloseCart={() => {
            dispatch(toggleCart(false));
            // Ensure checkout overlay closes when navigating via nav
            // using a custom event to avoid import cycle
            document.dispatchEvent(new CustomEvent("app:navigate"));
          }}
        />
      </div>
      <div className="header__right items-center gap-4">
        <select
          value={currentCity}
          onChange={changeCity}
          className="hidden md:block border border-gray-200 rounded-lg px-2 py-1 mr-2"
        >
          <option value="Kyiv">Kyiv</option>
        </select>
        <div
          className="flex header__favorites"
          onClick={() => {
            dispatch(toggleCart(false));
            history("/favorites");
          }}
        >
          <FaRegHeart className="size-6.5 fill-[rgb(238_99_68)]" />
          <span className="hidden lg:block md:pl-2!">Favorites</span>
        </div>
        <div onClick={signIn} className="flex header__login relative">
          {" "}
          {userActive ? (
            <FaUser className="size-6 fill-[rgb(238_99_68)]" />
          ) : (
            <MdOutlineLogin className="size-6.5 fill-[rgb(238_99_68)]" />
          )}
          {userActive ? (
            <span className="hidden lg:block md:pl-2! max-w-[5rem] leading-4">
              {(userActive && userActive.displayName) ||
                user?.displayName ||
                "User"}
            </span>
          ) : (
            <span className="hidden lg:block md:pl-2!">Log in</span>
          )}
          {userActive && isAccountOpen ? (
            <div className="absolute right-0 top-[110%] bg-white text-gray-800 rounded-xl shadow-lg w-44 py-2 z-30">
              {demoMode ? (
                <div className="px-4 py-2 text-xs text-amber-700 bg-amber-50">
                  Demo mode enabled
                </div>
              ) : null}
              {isAdmin ? (
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    setIsAccountOpen(false);
                    dispatch(toggleCart(false));
                    history("/admin/products");
                  }}
                >
                  Admin
                </button>
              ) : null}
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  setIsAccountOpen(false);
                  dispatch(toggleCart(false));
                  history("/account/orders");
                }}
              >
                Orders
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  setIsAccountOpen(false);
                  dispatch(toggleCart(false));
                  history("/account/addresses");
                }}
              >
                Addresses
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                onClick={() => {
                  setIsAccountOpen(false);
                  dispatch(logout());
                  localStorage.removeItem("demoMode");
                  signOut(auth).catch(() => {});
                }}
              >
                Logout
              </button>
            </div>
          ) : null}
        </div>
        <div className="flex lg:hidden header__cart">
          {isCartEmpty.length > 0 ? (
            <div className="relative">
              <IoCart
                className="size-7.5 fill-[rgb(238_99_68)] "
                onClick={() => dispatch(toggleCart())}
              />
              <span className="cart__count">{isCartEmpty.length}</span>
            </div>
          ) : (
            <IoCartOutline
              className="size-7.5 stroke-[rgb(238_99_68)]"
              onClick={() => dispatch(toggleCart())}
            />
          )}
        </div>
        <div className="flex md:hidden z-10 header__menu">
          {isActive ? (
            <IoMdClose
              className="size-6.5 fill-white"
              onClick={() => onActiveChange()}
            />
          ) : (
            <GiHamburgerMenu
              className="size-6.5 fill-[rgb(238_99_68)]"
              onClick={() => {
                dispatch(toggleCart(false));
                onActiveChange();
              }}
            />
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
