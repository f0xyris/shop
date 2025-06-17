import React, { useCallback, useEffect } from "react";
import "./Sortbar.css";
import { useDispatch, useSelector } from "react-redux";
import { showAllProducts } from "../../features/cart/cartSlice";
import { toggleSortedItem } from "../../features/sort/sortSlice";
import { useNavigate } from "react-router-dom";

const state = ["All", "Classic", "Maki", "Dragons", "Baked", "Felix", "Sweet"];

function Sortbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector(showAllProducts);

  const sortItem = useCallback(
    (sItem) => {
      let sortedItems = [];

      if (sItem === "All") {
        sortedItems = products;
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

  const sortedItems = state.map((item) => {
    return (
      <li key={item} onClick={() => sortItem(item)}>
        {item}
      </li>
    );
  });

  return <ul className="sort-nav">{sortedItems}</ul>;
}

export default Sortbar;
