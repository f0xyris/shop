import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { auth, db } from "../../firebase";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import sushiIcon from "../../images/sushi.svg";
import {
  addToCart,
  clearCart,
  addManyToCart,
} from "../../features/cart/cartSlice";
import Button from "../../components/button/Button";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;
  const dispatch = useDispatch();

  useEffect(() => {
    const load = async () => {
      if (!user) {
        setOrders([]);
        setLoading(false);
        return;
      }
      try {
        const q = query(
          collection(db, "users", user.uid, "orders"),
          orderBy("createdAt", "desc")
        );
        const snap = await getDocs(q);
        const base = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        // try to enrich missing images for items
        const categories = [
          "rolls",
          "sushi",
          "sets",
          "snacks",
          "drinks",
          "sauces",
        ];
        const cache = new Map();
        const resolveImageByTitle = async (title) => {
          if (cache.has(title)) return cache.get(title);
          for (const col of categories) {
            try {
              const q2 = query(
                collection(db, col),
                where("title", "==", title)
              );
              const s2 = await getDocs(q2);
              if (!s2.empty) {
                const img = s2.docs[0].data().image || null;
                cache.set(title, img);
                return img;
              }
            } catch (_) {}
          }
          cache.set(title, null);
          return null;
        };

        const withImages = await Promise.all(
          base.map(async (o) => ({
            ...o,
            items: await Promise.all(
              (o.items || []).map(async (it) => ({
                ...it,
                image:
                  it.image || (await resolveImageByTitle(it.title)) || null,
              }))
            ),
          }))
        );
        setOrders(withImages);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const reorder = async (order) => {
    dispatch(clearCart());
    const categories = ["rolls", "sushi", "sets", "snacks", "drinks", "sauces"];

    const resolveImage = async (item) => {
      if (item.image) return item.image;
      for (const col of categories) {
        try {
          const q = query(
            collection(db, col),
            where("title", "==", item.title)
          );
          const snap = await getDocs(q);
          if (!snap.empty) {
            const data = snap.docs[0].data();
            return data.image || null;
          }
        } catch (_) {
          // ignore and continue
        }
      }
      return null;
    };

    // показываем прелоадер корзины на время массового добавления
    dispatch({ type: "cartItems/setCartLoading", payload: true });
    const results = await Promise.all(
      order.items.map(async (it) => ({
        id: it.id,
        title: it.title,
        image: it.image || (await resolveImage(it)),
        unitPrice: it.unitPrice,
        count: it.count,
      }))
    );
    dispatch(addManyToCart(results));
    dispatch({ type: "cartItems/setCartLoading", payload: false });
  };

  if (loading) {
    return (
      <div className="content w-[100vw] lg:w-[69vw] xl:w-[67vw] p-6">
        <div className="max-w-[64rem] mx-auto animate-pulse space-y-4">
          <div className="h-6 w-40 bg-gray-200 rounded"></div>
          {[0, 1].map((k) => (
            <div key={k} className="border rounded-2xl p-4">
              <div className="flex justify-between mb-3">
                <div className="h-5 w-48 bg-gray-200 rounded"></div>
                <div className="h-5 w-24 bg-gray-200 rounded"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="border rounded-xl p-3 bg-gray-50">
                    <div className="h-14 w-14 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded mb-1"></div>
                    <div className="h-4 w-16 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (!user) return <div className="p-4">Sign in to view orders</div>;

  return (
    <div className="content w-[100vw] lg:w-[69vw] xl:w-[67vw] p-6 box-border">
      <div className="max-w-[64rem] mx-auto">
        <h2 className="text-xl font-semibold mb-4">Your Orders</h2>
        {orders.length === 0 ? (
          <div>No orders yet</div>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <div
                key={o.id}
                className="border rounded-xl p-4 w-full overflow-hidden"
              >
                <div className="flex justify-between">
                  <div>
                    <div className="font-semibold">
                      Order #{o.id.slice(0, 6)}...
                    </div>
                    <div className="text-sm text-gray-600">
                      Status: {o.status}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{o.total} UAH</div>
                    {o.payment?.status && (
                      <div className="text-sm text-gray-600">
                        Payment: {o.payment.status}
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {o.items.map((it) => (
                    <div
                      key={it.id + it.title}
                      className="border rounded-xl p-3 flex items-center gap-3 bg-gray-50"
                    >
                      <img
                        src={it.image || sushiIcon}
                        alt={it.title}
                        className="w-14 h-14 object-cover rounded-lg bg-white border"
                        onError={(e) => (e.currentTarget.src = sushiIcon)}
                      />
                      <div className="flex-1">
                        <div className="font-medium leading-5">{it.title}</div>
                        <div className="text-xs text-gray-600">
                          × {it.count}
                        </div>
                      </div>
                      <div className="font-semibold whitespace-nowrap">
                        {it.lineTotal} UAH
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-right">
                  <Button
                    title="Reorder"
                    type="orange"
                    disabled={false}
                    action={() => {
                      reorder(o);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
