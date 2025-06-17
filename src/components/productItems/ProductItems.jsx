import React, { useCallback, useEffect, useState } from "react";
import Button from "../button/Button";
import Slider from "react-slick";
import { db } from "../../firebase";
import { collection, getDocs, doc, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { add, del, showFavorites } from "../../features/fav/favSlice";
import { addToCart, addProducts } from "../../features/cart/cartSlice";
import {
  showSortedItems,
  resetSortedItems,
} from "../../features/sort/sortSlice";

import "./ProductItems.css";

function ProductItems({
  collectionName,
  activeSlider,
  button,
  showFavs,
  hideTitle,
}) {
  let [products, setProducts] = useState([]);
  let [mounted, setMounted] = useState(true);
  const [hasReset, setHasReset] = useState(false);

  const favItem = useSelector(showFavorites);
  const sortedItems = useSelector(showSortedItems);

  const history = useNavigate();
  const dispatch = useDispatch();

  const fetchProducts = useCallback(async () => {
    try {
      const productsCollection = collection(db, collectionName);
      const productsSnapshot = await getDocs(productsCollection);
      const productsList = productsSnapshot.docs.map((doc) => doc.data());
      setProducts(productsList);
    } catch (error) {
      console.error("Error fetching products: ", error);
    }
  }, [collectionName]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    dispatch(addProducts(products));
  }, [products, dispatch]);

  const settings = {
    dots: false,
    speed: 500,
    arrows: true,
    slidesToScroll: 1,
    slidesToShow: 1,
    variableWidth: true,
    infinite: true,
    responsive: [
      {
        breakpoint: 2024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 425,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const toggleFav = useCallback(
    (index) => {
      const addItemIndex = favItem.findIndex(
        ({ title }) => title === products[index].title
      );
      const itemIndex = products[index].id;
      const docRef = doc(db, collectionName, itemIndex);

      if (addItemIndex < 0) {
        onSnapshot(docRef, { fav: true });

        dispatch(add(products[index]));
        setMounted(!mounted);
      } else {
        onSnapshot(docRef, { fav: false });

        dispatch(del(products[index]));
        setMounted(!mounted);
      }
    },
    [dispatch, favItem, products, mounted, collectionName]
  );

  const addToCartList = useCallback(
    (index) => {
      dispatch(addToCart(products[index]));
    },
    [dispatch, products]
  );

  useEffect(() => {
    dispatch(addProducts(products));
  }, [products, dispatch]);

  const truncate = (string, n) => {
    return string?.length > n ? string.substr(0, n - 1) + "..." : string;
  };

  let finalProducts = products || [];
  if (showFavs) {
    finalProducts = favItem || [];
  }
  if (
    sortedItems &&
    Object.keys(sortedItems).length > 0 &&
    finalProducts !== sortedItems
  ) {
    finalProducts = sortedItems;
  }

  useEffect(() => {
    if (hasReset) return;
    dispatch(resetSortedItems());
    setHasReset(true);

    finalProducts = products || [];
    if (showFavs) {
      finalProducts = favItem || [];
    }
    if (
      sortedItems &&
      Object.keys(sortedItems).length > 0 &&
      finalProducts !== sortedItems
    ) {
      finalProducts = sortedItems;
    }
    finalProducts = finalProducts.filter(
      (item) => item.collectionName === collectionName
    );
  }, [collectionName, products, sortedItems, favItem, dispatch, hasReset]);

  const items = finalProducts.map((item, idx) => {
    return (
      <div
        className="productItems__item w-full sm:w-[45%] md:w-[30%] 2xl:w-[20%]"
        key={item.id || `${item.title}-${idx}`}
        style={activeSlider ? { width: 300 } : {}}
      >
        <div className="productItems__image">
          <img
            src={item.image}
            alt={item.title}
            className="sm:object-contain! xl:object-cover!"
          />
          <div className="productItems__fav">
            {
              <span onClick={() => toggleFav(idx)}>
                <i
                  className={`fa fa-heart-o ${
                    favItem.some((fav) => fav.title === item.title)
                      ? "active"
                      : ""
                  }`}
                  aria-hidden="true"
                ></i>
              </span>
            }
          </div>
          {item?.eco ? (
            <div className="productItems__eco">
              <span>
                <i className="fa fa-leaf" aria-hidden="true"></i>
              </span>
            </div>
          ) : null}
          {item?.spicy ? (
            <div className="productItems__spicy">
              <span>
                <i className="fa fa-fire" aria-hidden="true"></i>
              </span>
            </div>
          ) : null}
        </div>
        <div className="productItems__cart">
          <h4>{item.title}</h4>
          <div className="productItems__desc">
            <h5>
              <span>{item.weight} g </span>
              {truncate(item.desc, 55)}
            </h5>
          </div>
          <div className="productItems__order">
            <Button
              title="Add to cart"
              type="green"
              disabled={false}
              action={() => addToCartList(idx)}
            />
            <span className="text-xl lg:text-2xl">
              {item.price}
              <small> uah</small>
            </span>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className="mt-5">
      {hideTitle ? null : (
        <h2 className="-top-7! sm:top-auto! pl-2 uppercase">
          {collectionName}
        </h2>
      )}
      <div
        className="productItems "
        style={!activeSlider ? { display: "flex" } : {}}
      >
        {button ? (
          <Button
            action={() => history(`/${collectionName}`)}
            type="orange"
            title={`All ${collectionName}`}
            disabled={false}
          />
        ) : null}

        {activeSlider ? <Slider {...settings}> {items} </Slider> : items}
      </div>
    </div>
  );
}

export default ProductItems;
