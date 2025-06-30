import React from "react";
import "./Nav.css";

import { useNavigate } from "react-router";

function Nav({ onCloseCart }) {
  const history = useNavigate();

  return (
    <div className="nav flex-col md:flex-row w-full max-h-[20rem]">
      <ul className="nav__items flex-col md:flex-row">
        <li
          onClick={() => {
            onCloseCart();
            history("/shop");
          }}
        >
          Home
        </li>
        <li
          onClick={() => {
            onCloseCart();
            history("/menu");
          }}
        >
          Menu
        </li>
        <li
          onClick={() => {
            onCloseCart();
            history("/delivery");
          }}
        >
          Delivery
        </li>
        <li
          onClick={() => {
            onCloseCart();
            history("/customers");
          }}
        >
          For customers
        </li>
        <li
          onClick={() => {
            onCloseCart();
            history("/news");
          }}
        >
          News
        </li>
      </ul>
    </div>
  );
}

export default Nav;
