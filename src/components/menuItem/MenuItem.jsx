import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import "./MenuItem.css";
import { toggleCart } from "../../features/cart/cartSlice";

function MenuItem({ image, title }) {
  const history = useNavigate();
  const dispatch = useDispatch();

  return (
    <div
      onClick={() => {
        dispatch(toggleCart(false));
        history(`/${title}`);
      }}
      className="menuItem text-amber-50 lg:text-gray-800"
    >
      {image ? <img src={image} className="flex-shrink-0" alt="" /> : null}
      <span>{title}</span>
    </div>
  );
}

export default MenuItem;
