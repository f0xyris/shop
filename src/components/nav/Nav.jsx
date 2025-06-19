import React from "react";
import "./Nav.css";

import { useNavigate } from "react-router";

function Nav({ onActiveChange }) {
  const history = useNavigate();

  return (
    <div className="nav flex-col md:flex-row w-full max-h-[20rem]">
      <ul className="nav__items flex-col md:flex-row">
        <li
          onClick={() => {
            onActiveChange();
            history("/shop");
          }}
        >
          Home
        </li>
        <li
          onClick={() => {
            onActiveChange();
            history("/menu");
          }}
        >
          Menu
        </li>
        <li
          onClick={() => {
            onActiveChange();
            history("/delivery");
          }}
        >
          Delivery
        </li>
        <li
          onClick={() => {
            onActiveChange();
            history("/customers");
          }}
        >
          For customers
        </li>
        <li
          onClick={() => {
            onActiveChange();
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
