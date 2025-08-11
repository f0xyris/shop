import React, { useCallback, useEffect } from "react";
import MenuItem from "../menuItem/MenuItem";
import "./Cart.css";
import cart from "../../images/cart.svg";
import Button from "../button/Button";
import { useDispatch, useSelector } from "react-redux";
import {
  showCartItems,
  isCartOpened,
  toggleCart,
} from "../../features/cart/cartSlice";
import {
  delFromCart,
  addToCart,
  delCounter,
} from "../../features/cart/cartSlice";
import { toggleCheckout } from "../../features/checkout/checkoutSlice";
import { isCartLoading } from "../../features/cart/cartSlice";
import Spinner from "../spinner/Spinner";
import { useSelector as useReduxSelector } from "react-redux";
import { selectMinOrder } from "../../features/settings/settingsSlice";

export default function Cart() {
  const minSum = useReduxSelector(selectMinOrder);
  let countSum = 0;
  let isDisabled = true;
  const menuItem = ["rolls", "sushi", "sets", "snacks", "drinks", "sauces"];

  const cartItems = useSelector(showCartItems);
  const isOpen = useSelector(isCartOpened);
  const loading = useSelector(isCartLoading);

  const dispatch = useDispatch();
  const increaseCounter = useCallback(
    (index) => {
      dispatch(addToCart(cartItems[index]));
    },
    [dispatch, cartItems]
  );

  const decreaseCounter = useCallback(
    (index) => {
      dispatch(delCounter(cartItems[index]));
    },
    [dispatch, cartItems]
  );

  const deleteItem = useCallback(
    (index) => {
      const addItemIndex = cartItems.findIndex(
        ({ title }) => title === cartItems[index].title
      );

      if (addItemIndex >= 0) {
        dispatch(delFromCart(cartItems[index]));
      }
    },
    [dispatch, cartItems]
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        dispatch(toggleCart(false));
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [dispatch]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  const checkoutOrder = () => {
    dispatch(toggleCheckout(true));
  };

  const items = cartItems.map((item, idx) => {
    const line = Number(item.lineTotal ?? item.price ?? 0);
    countSum += line;

    if (countSum > minSum) {
      isDisabled = false;
    }
    return (
      <div
        key={item.title}
        className="cart-item lg:flex-col-reverse xl:flex-row xl:w-[28vw] md:w-[24vw]"
      >
        <div className="cart-item__info p-1 md:p-3 lg:items-center text-black">
          <span className="cart-item__title flex md:justify-center">
            {item.title}
          </span>
          <div className="cart-item__price md:flex-col! gap-2 w-[10rem] md:w-[13rem]">
            <div className="flex items-center justify-around w-full">
              <span
                className="cart-item__minus"
                onClick={() => decreaseCounter(idx)}
              ></span>
              <span className="cart-item__count">{item.count}</span>
              <span
                className="cart-item__plus"
                onClick={() => increaseCounter(idx)}
              ></span>
            </div>
            <span className="cart-info__currency">{line} uah</span>
          </div>
        </div>
        <img src={item.image} alt={item.title} />
        <span onClick={() => deleteItem(idx)}>
          <i className="fa fa-times delete" aria-hidden="true"></i>
        </span>
      </div>
    );
  });

  return (
    <div
      className={`cart md:justify-start md:items-start lg:justify-center lg:items-center lg:w-[30vw] lg:flex xl:w-[32vw] md:h-full ${
        isOpen
          ? "flex fixed left-0 right-0 top-[4rem] z-20! bg-amber-700 text-white fullscreen-under-header"
          : "hidden"
      }`}
    >
      <div className="cart__scroll h-full md:h-auto flex-col items-center md:pt-[2rem]! md:flex-row md:justify-around md:flex-wrap md:items-start lg:flex-row lg:justify-center lg:items-center max-h-[calc(100vh-9rem)]">
        {loading ? (
          <div className="h-[80vh] flex items-center justify-center w-full">
            <Spinner />
          </div>
        ) : Object.keys(cartItems).length > 0 ? (
          items
        ) : (
          <div className="cart__empty h-[80vh] lg:h-full flex flex-col justify-center max-w-[25rem] md:max-w-auto">
            <div className="cart__info text-white lg:text-black justify-center">
              <img
                src={cart}
                alt=""
                className="filter invert-100 brightness-0 lg:invert-0 lg:brightness-100"
              />
              <span className="text-amber-50 lg:text-gray-700">
                Add a product to cart. Everything is very delicious here
              </span>
            </div>

            <div className="cart__items">
              {menuItem.map((item) => (
                <MenuItem key={item} title={item} />
              ))}
            </div>

            <Button
              title="Order history"
              type="orange"
              disabled={false}
              action={() => {
                dispatch(toggleCart(false));
                window.location.href = "/account/orders";
              }}
            />
          </div>
        )}
      </div>

      <div className="cart__order">
        {countSum < minSum ? <p>Minimum order sum {minSum} uah</p> : null}

        <div className="cart__order-wrapper">
          <div className="cart__order-count">
            <small>Total:</small>
            <span>
              {countSum} <span>uah</span>
            </span>
          </div>
          <Button
            title="Checkout"
            type={isDisabled ? "inactive" : "action"}
            disabled={isDisabled}
            action={() => checkoutOrder()}
          />
        </div>
      </div>
    </div>
  );
}
