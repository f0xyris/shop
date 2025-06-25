import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

import logo from "../../images/ninja-logo.svg";
import { useDispatch, useSelector } from "react-redux";
import "./Header.css";
import { logout, selectUser } from "../../features/user/userSlice";
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

function Header() {
  const [isActive, setIsActive] = useState(false);
  const userActive = useSelector(selectUser);
  const isCartEmpty = useSelector(showCartItems);
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

    dispatch(toggleCart(false));
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
            ? "w-full bg-amber-700 text-white absolute left-0 right-0 bottom-[22rem] top-0 min-h-screen fade-slide-in"
            : "fade-slide-out"
        }`}
      >
        <Nav onActiveChange={onActiveChange} />
      </div>
      <div className="header__right items-center gap-4">
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
        <div onClick={signIn} className="flex header__login">
          {" "}
          {userActive ? (
            <FaUser className="size-6 fill-[rgb(238_99_68)]" />
          ) : (
            <MdOutlineLogin className="size-6.5 fill-[rgb(238_99_68)]" />
          )}
          {userActive ? (
            <span className="hidden lg:block md:pl-2! max-w-[5rem] leading-4">
              {user.displayName}
            </span>
          ) : (
            <span className="hidden lg:block md:pl-2!">Log in</span>
          )}
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
