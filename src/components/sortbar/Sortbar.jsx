import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./Sortbar.css";
import { useDispatch, useSelector } from "react-redux";
import { showAllProducts } from "../../features/cart/cartSlice";
import { toggleSortedItem } from "../../features/sort/sortSlice";
import { useNavigate } from "react-router-dom";

const state = [
  "All",
  "New",
  "Classic",
  "Maki",
  "Dragons",
  "Baked",
  "Felix",
  "Sweet",
];

function Sortbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector(showAllProducts);

  const sortItem = useCallback(
    (sItem) => {
      let sortedItems = [];

      if (sItem === "All") {
        sortedItems = products;
      } else if (sItem === "New") {
        sortedItems = products.filter((item) => !!item.isNew);
      } else {
        sortedItems = products.filter(
          (item) => item.type === sItem.toLowerCase()
        );
      }

      sortedItems = sortedItems.filter(
        (value, index, self) =>
          index === self.findIndex((t) => t.id === value.id)
      );

      dispatch(toggleSortedItem(sortedItems));
      navigate(`/rolls?sort=${sItem}`, { replace: true });
    },
    [products, dispatch, navigate]
  );

  const location = window.location;
  const queryParams = new URLSearchParams(location.search);
  const currentSort = queryParams.get("sort");

  useEffect(() => {
    if (!currentSort) {
      sortItem("All");
    } else {
      sortItem(currentSort);
    }
  }, [currentSort, sortItem]);

  const [open, setOpen] = useState(false);
  const items = useMemo(
    () =>
      state.map((item) => (
        <li key={item} onClick={() => sortItem(item)}>
          {item}
        </li>
      )),
    [sortItem]
  );

  return (
    <div className="sortbar-wrap">
      <div className="sortbar-scroll">
        <ul className="sort-nav">{items}</ul>
      </div>
      <div className="sortbar-dropdown">
        <button className="sortbar-toggle" onClick={() => setOpen((v) => !v)}>
          Filters <span className="fa fa-chevron-down" />
        </button>
        {open && <ul className="sort-nav-mobile">{items}</ul>}
      </div>
    </div>
  );
}

export default Sortbar;
