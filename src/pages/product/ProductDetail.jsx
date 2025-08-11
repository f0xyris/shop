import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import Button from "../../components/button/Button";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../features/cart/cartSlice";
import {
  add,
  del,
  showFavorites,
  addFavoriteRemote,
  deleteFavoriteRemote,
} from "../../features/fav/favSlice";
import Slider from "react-slick";
import "./ProductDetail.css";

export default function ProductDetail() {
  const { collection: collectionName, id } = useParams();
  const location = useLocation();
  const prefetch = location.state?.prefetch;
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const favs = useSelector(showFavorites);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      // optimistic seed from navigation prefetch if provided
      if (
        prefetch &&
        (prefetch.id === id || decodeURIComponent(prefetch.id || "") === id) &&
        prefetch.collectionName === collectionName
      ) {
        setProduct(prefetch);
      }
      // keep previous related items visible during fetch for smoother UX
      window.scrollTo({ top: 0, behavior: "smooth" });
      try {
        const ref = doc(db, collectionName, id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setProduct({ ...snap.data(), id: snap.id, collectionName });
        } else {
          // fallback: try find by title if route was built without id
          const title = decodeURIComponent(id);
          const qByTitle = query(
            collection(db, collectionName),
            where("title", "==", title)
          );
          const s2 = await getDocs(qByTitle);
          if (!s2.empty) {
            const d = s2.docs[0];
            setProduct({ id: d.id, collectionName, ...d.data() });
          }
        }
        const relSnap = await getDocs(collection(db, collectionName));
        const currentId = snap?.id || id;
        const seen = new Set();
        const relList = [];
        for (const d of relSnap.docs) {
          if (d.id === currentId) continue;
          if (seen.has(d.id)) continue;
          seen.add(d.id);
          relList.push({ ...d.data(), id: d.id, collectionName });
          if (relList.length >= 12) break;
        }
        setRelated(relList);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [collectionName, id]);

  const isFav = useMemo(() => {
    if (!product) return false;
    return favs.some(
      (f) => (f.id ?? f.title) === (product.id ?? product.title)
    );
  }, [favs, product]);

  const toggleFavorite = async () => {
    if (!product) return;
    if (isFav) {
      dispatch(del(product));
      await dispatch(deleteFavoriteRemote(product));
    } else {
      dispatch(add(product));
      await dispatch(addFavoriteRemote(product));
    }
  };

  if (loading && !product)
    return (
      <div className="content w-[100vw] lg:w-[69vw] xl:w-[67vw] p-6">
        Loading...
      </div>
    );
  if (!product)
    return (
      <div className="content w-[100vw] lg:w-[70vw] xl:w-[68vw] p-6">
        Product not found
      </div>
    );

  const grams = product.weight || product.grams || product.g || null;
  const pieces = product.pieces || product.pcs || product.count || null;
  const badges = {
    isNew: product.isNew,
    isTop: product.isTop,
    spicy: product.spicy,
    eco: product.eco,
  };

  const Arrow = ({ onClick, direction }) => (
    <button
      aria-label={direction === "left" ? "Previous" : "Next"}
      onClick={onClick}
      className="absolute top-[57%] -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-gray-300 shadow flex items-center justify-center"
      style={{
        outline: "none",
        [direction === "left" ? "left" : "right"]: -15,
      }}
    >
      <i
        className={`fa ${
          direction === "left" ? "fa-chevron-left" : "fa-chevron-right"
        }`}
      />
    </button>
  );

  return (
    <div className="content pl-[4.5rem]! md:pl-[6.5rem]! w-[calc(100vw-1rem)] lg:w-[66vw] xl:w-[65vw]">
      <div className="bg-white rounded-2xl shadow-md p-3 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="flex items-center justify-center bg-gray-50 rounded-2xl p-3 md:p-4">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-auto max-h-[45vh] md:max-h-[22rem] object-contain"
          />
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            {badges.isNew ? (
              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                New
              </span>
            ) : null}
            {badges.isTop ? (
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                Top
              </span>
            ) : null}
            {badges.spicy ? (
              <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                Spicy
              </span>
            ) : null}
            {badges.eco ? (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                Eco
              </span>
            ) : null}
          </div>
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <div className="text-gray-600">
            {grams ? <span>{grams} g</span> : null}
            {grams && pieces ? <span> / </span> : null}
            {pieces ? <span>{pieces} pcs</span> : null}
          </div>
          {product.desc ? (
            <p className="text-gray-700 leading-6">{product.desc}</p>
          ) : null}
          {product.ingredients ? (
            <div className="text-sm text-gray-700">
              <span className="font-semibold">Ingredients:</span>{" "}
              {Array.isArray(product.ingredients)
                ? product.ingredients.join(", ")
                : String(product.ingredients)}
            </div>
          ) : null}

          <div className="mt-2 flex items-center gap-4">
            <div className="text-3xl font-bold">
              {product.price} <span className="text-lg font-semibold">uah</span>
            </div>
            <Button
              title="Add to cart"
              type="action"
              disabled={false}
              action={() => dispatch(addToCart(product))}
            />
            <button
              aria-label="favorite"
              onClick={toggleFavorite}
              className="w-10 h-10 rounded-xl bg-transparent flex items-center justify-center"
              style={{ outline: "none", border: "none" }}
            >
              <i
                className={`fa ${isFav ? "fa-heart" : "fa-heart-o"}`}
                style={{ color: "#ee6344", fontSize: 22 }}
              />
            </button>
          </div>
        </div>
      </div>

      {related.length > 0 ? (
        <div className="mt-6 w-full relative related-slider">
          <h3 className="text-xl font-semibold my-4">You may also like</h3>
          <Slider
            dots={false}
            speed={500}
            arrows
            slidesToScroll={1}
            slidesToShow={4}
            infinite={false}
            nextArrow={<Arrow direction="right" />}
            prevArrow={<Arrow direction="left" />}
            responsive={[
              { breakpoint: 1400, settings: { slidesToShow: 4 } },
              { breakpoint: 1200, settings: { slidesToShow: 3 } },
              { breakpoint: 1024, settings: { slidesToShow: 2 } },
              {
                breakpoint: 768,
                settings: { slidesToShow: 2, arrows: false, dots: true },
              },
              {
                breakpoint: 600,
                settings: { slidesToShow: 1, arrows: false, dots: true },
              },
            ]}
          >
            {related.map((r, idx) => (
              <div
                key={`${r.collectionName}-${r.id}-${idx}`}
                className="px-1 md:px-2"
              >
                <div
                  className="border rounded-xl p-2 hover:shadow cursor-pointer bg-white"
                  onClick={() =>
                    navigate(
                      `/product/${encodeURIComponent(
                        r.collectionName
                      )}/${encodeURIComponent(r.id)}`,
                      { state: { prefetch: r } }
                    )
                  }
                >
                  <img
                    src={r.image}
                    alt={r.title}
                    className="h-28 w-full object-contain"
                  />
                  <div className="text-sm font-medium mt-1 line-clamp-1">
                    {r.title}
                  </div>
                  <div className="text-sm text-gray-600">{r.price} uah</div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      ) : null}
    </div>
  );
}
