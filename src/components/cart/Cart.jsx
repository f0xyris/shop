import React, { useCallback } from "react";
import MenuItem from "../menuItem/MenuItem";
import "./Cart.css";
import cart from "../../images/cart.svg";
import Button from "../button/Button";

import { useDispatch, useSelector } from "react-redux";
import { showCartItems } from "../../features/cart/cartSlice";
import {
  delFromCart,
  addToCart,
  delCounter,
} from "../../features/cart/cartSlice";

export default function Cart() {
  const minSum = 400;
  let countSum = 0;
  let isDisabled = true;
  const menuItem = ["rolls", "sushi", "sets", "snacks", "drinks", "sauces"];

  const cartItems = useSelector(showCartItems);
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

  const items = cartItems.map((item, idx) => {
    countSum += parseInt(item.price);

    if (countSum > minSum) {
      isDisabled = false;
    }
    return (
      <div
        key={item.title}
        className="cart-item sm:flex-col-reverse xl:flex-row xl:w-[28vw] md:w-[24vw]"
      >
        <div className="cart-item__info p-3 lg:items-center">
          <span className="cart-item__title flex md:justify-center">
            {item.title}
          </span>
          <div className="cart-item__price md:flex-col! gap-2">
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
            <span className="cart-info__currency">{item.price} uah</span>
          </div>
        </div>
        <img
          src={item.image}
          alt={item.title}
          className="sm:hidden! lg:flex!"
        />
        <span onClick={() => deleteItem(idx)}>
          <i className="fa fa-times delete" aria-hidden="true"></i>
        </span>
      </div>
    );
  });

  return (
    <div className="cart hidden lg:w-[30vw] lg:flex xl:w-[32vw]">
      <div className="cart__scroll">
        {Object.keys(cartItems).length > 0 ? (
          items
        ) : (
          <div className="cart__empty">
            <div className="cart__info">
              <img src={cart} alt="" />
              <span>
                Add a product to cart. Everything is very delicious here
              </span>
            </div>

            <div className="cart__items">
              {menuItem.map((item) => (
                <MenuItem key={item} title={item} />
              ))}
            </div>

            <Button title="Order history" type="orange" disabled={false} />
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
          />
        </div>
      </div>
    </div>
  );
}
