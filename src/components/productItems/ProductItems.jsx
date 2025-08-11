import React, { useCallback, useEffect, useMemo, useState } from "react";
import Button from "../button/Button";
import Slider from "react-slick";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  add,
  del,
  showFavorites,
  addFavoriteRemote,
  deleteFavoriteRemote,
} from "../../features/fav/favSlice";
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
      const productsList = productsSnapshot.docs.map((productDoc) => ({
        ...productDoc.data(),
        id: productDoc.id,
        collectionName,
      }));
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
          variableWidth: false,
        },
      },
    ],
  };

  const toggleFav = useCallback(
    async (item) => {
      if (!item || !item.id) {
        console.warn("Invalid product:", item);
        return;
      }

      const keyOf = (x) => x?.id ?? x?.title;
      const isFav = favItem.some((f) => keyOf(f) === keyOf(item));

      try {
        // Local state
        dispatch(isFav ? del(item) : add(item));
        // Remote per-user favorites
        if (isFav) {
          await dispatch(deleteFavoriteRemote(item));
        } else {
          await dispatch(addFavoriteRemote(item));
        }
        setMounted((prev) => !prev);
      } catch (error) {
        console.error("Ошибка при обновлении fav:", error);
      }
    },
    [dispatch, favItem, collectionName]
  );

  const addToCartList = useCallback(
    (item) => {
      dispatch(addToCart(item));
    },
    [dispatch]
  );

  const truncate = (string, n) => {
    return string?.length > n ? string.substr(0, n - 1) + "..." : string;
  };

  const finalProducts = useMemo(() => {
    let list = showFavs ? favItem || [] : products || [];
    if (sortedItems && Array.isArray(sortedItems) && sortedItems.length > 0) {
      list = sortedItems;
    }
    // de-duplicate by id or title
    const seen = new Set();
    list = list.filter((it) => {
      const key = it.id ?? it.title;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    return list;
  }, [products, favItem, sortedItems, collectionName, showFavs]);

  useEffect(() => {
    if (hasReset) return;
    dispatch(resetSortedItems());
    setHasReset(true);
  }, [dispatch, hasReset]);

  const items = finalProducts.map((item, idx) => {
    return (
      <div
        className="productItems__item w-full sm:w-[45%] md:w-[30%] 2xl:w-[25%] max-w-[18rem]"
        key={`${item.title}-${idx}`}
        style={activeSlider ? { width: 300 } : {}}
      >
        <div className="productItems__image">
          <img
            src={item.image}
            alt={item.title}
            className="sm:object-contain! xl:object-cover! cursor-pointer"
            onClick={() =>
              history(
                `/product/${encodeURIComponent(
                  item.collectionName || collectionName
                )}/${encodeURIComponent(item.id)}`,
                { state: { prefetch: item } }
              )
            }
          />
          <div className="productItems__fav">
            {
              <span onClick={() => toggleFav(item)}>
                <i
                  className={`fa fa-heart-o ${
                    favItem.some(
                      (fav) => (fav.id ?? fav.title) === (item.id ?? item.title)
                    )
                      ? "active"
                      : ""
                  }`}
                  aria-hidden="true"
                ></i>
              </span>
            }
          </div>
          {item?.isNew || item?.isTop ? (
            <div className="absolute left-2 top-2 flex flex-col gap-1 z-[1]">
              {item?.isNew ? (
                <span className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wide rounded-md bg-emerald-500 text-white shadow">
                  New
                </span>
              ) : null}
              {item?.isTop ? (
                <span className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wide rounded-md bg-amber-500 text-white shadow">
                  Top
                </span>
              ) : null}
            </div>
          ) : null}
          {item?.eco ? (
            <div className="productItems__eco">
              <span>
                <i className="fa fa-leaf" aria-hidden="true"></i>
              </span>
            </div>
          ) : item?.spicy ? (
            <div className="productItems__spicy">
              <span>
                <i className="fa fa-fire" aria-hidden="true"></i>
              </span>
            </div>
          ) : null}
        </div>
        <div className="productItems__cart">
          <h4
            className="cursor-pointer"
            onClick={() =>
              history(
                `/product/${encodeURIComponent(
                  item.collectionName || collectionName
                )}/${encodeURIComponent(item.id)}`,
                { state: { prefetch: item } }
              )
            }
          >
            {item.title}
          </h4>
          <div className="productItems__desc">
            <h5>
              <span>{item.weight} g </span>
              {truncate(item.desc, 55)}
            </h5>
          </div>
          <div className="py-1" />
          <div className="productItems__order">
            <Button
              title="Add to cart"
              type="green"
              disabled={false}
              action={() => addToCartList(item)}
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
    <div className="mt-5 relative">
      {hideTitle ? null : (
        <h2 className="-top-7! sm:top-auto! pl-2 uppercase">
          {collectionName}
        </h2>
      )}
      <div
        className="productItems pt-[3rem]!"
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
