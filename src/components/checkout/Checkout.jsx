import React from "react";
import Button from "../button/Button";
import {
  showCartItems,
  clearCart,
  toggleCart,
} from "../../features/cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import emailjs from "emailjs-com";
import { auth, db } from "../../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { httpsCallable, getFunctions } from "firebase/functions";
import { useEffect } from "react";
import {
  fetchZonesByCity,
  selectZones,
  selectSelectedZoneId,
  setSelectedZone,
  selectDeliveryFee,
  selectCity,
} from "../../features/settings/settingsSlice";
import { toggleCheckout } from "../../features/checkout/checkoutSlice";

export const Checkout = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(showCartItems);
  const zones = useSelector(selectZones);
  const selectedZoneId = useSelector(selectSelectedZoneId);
  const deliveryFee = useSelector(selectDeliveryFee);
  const city = useSelector(selectCity);
  const countSum = cartItems.reduce((sum, item) => {
    const line = Number(item.lineTotal ?? item.price ?? 0);
    return sum + line;
  }, 0);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    dispatch(fetchZonesByCity(city));
  }, [city, dispatch]);

  const onSubmit = async (data) => {
    const templateParams = {
      name: data.name,
      phone: data.phone,
      email: data.email,
      city: data.city,
      address: data.address,
      notes: data.notes || "—",
      order_items: cartItems
        .map((item) => `${item.title} — ${item.lineTotal ?? item.price} UAH`)
        .join("\n"),
      total: countSum,
    };

    const ownerEmail = "antip4uck.ia@gmail.com";

    try {
      // Persist order to Firestore for authenticated users
      const user = auth.currentUser;
      if (user) {
        const orderPayload = {
          status: "created",
          items: cartItems.map((it) => ({
            id: it.id ?? it.title,
            title: it.title,
            image: it.image ?? null,
            unitPrice: Number(it.unitPrice ?? it.price ?? 0),
            count: Number(it.count ?? 1),
            lineTotal: Number(it.lineTotal ?? it.price ?? 0),
          })),
          total: countSum + Number(deliveryFee || 0),
          contact: {
            name: data.name,
            phone: data.phone,
            email: data.email,
            city: data.city,
            address: data.address,
            notes: data.notes || "—",
          },
          createdAt: serverTimestamp(),
          payment: { method: "cod", status: "pending" },
        };
        const orderRef = await addDoc(
          collection(db, "users", user.uid, "orders"),
          orderPayload
        );
        // Optional: start Stripe Checkout
        const functions = getFunctions();
        const createCheckoutSession = httpsCallable(
          functions,
          "createCheckoutSession"
        );
        const resp = await createCheckoutSession({
          items: orderPayload.items,
          currency: "uah",
          successUrl: window.location.origin + "/?paid=1",
          cancelUrl: window.location.origin + "/?cancel=1",
        });
        if (resp?.data?.url) {
          if (resp?.data?.id) {
            const { doc, updateDoc } = await import("firebase/firestore");
            await updateDoc(doc(db, "users", user.uid, "orders", orderRef.id), {
              payment: {
                ...(orderPayload.payment || {}),
                provider: "stripe",
                status: "pending",
                sessionId: resp.data.id,
                checkoutUrl: resp.data.url,
              },
            });
          }
          window.location.href = resp.data.url;
          return;
        }
      }

      await Promise.all([
        emailjs.send(
          "service_bxpbvnl",
          "template_3wkhv9a",
          { ...templateParams },
          "IwzLnjMLpaxCgqWSW"
        ),
        emailjs.send(
          "service_bxpbvnl",
          "template_3wkhv9a",
          { ...templateParams, email: ownerEmail },
          "IwzLnjMLpaxCgqWSW"
        ),
      ]);

      reset();
      dispatch(clearCart());
      dispatch(toggleCheckout(false));
      dispatch(toggleCart(false));
    } catch (err) {
      console.error("Ошибка:", err);
      alert("Ошибка при отправке заказа.");
    }
  };

  return (
    <div className="min-h-screen container-fluid bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 pt-[5rem]!">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl space-y-6 p-4">
        <h2 className="text-2xl font-bold text-gray-800">Order Checkout</h2>

        <div className="space-y-4 py-4">
          <h3 className="text-lg font-semibold text-gray-700">Your Items</h3>
          <div className="divide-y divide-gray-200">
            {cartItems.map((item) => (
              <div
                key={item.title}
                className="flex justify-between items-center py-3"
              >
                <div>
                  <p className="font-medium text-gray-800 mb-0!">
                    {item.title}
                  </p>
                </div>
                <span className="font-semibold text-gray-700">
                  {item.price} UAH
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-200 text-gray-800">
            <div className="flex justify-between text-base">
              <span>Subtotal:</span>
              <span>{countSum} UAH</span>
            </div>
            <div className="flex justify-between text-base">
              <span>Delivery fee:</span>
              <span>{Number(deliveryFee || 0)} UAH</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>{countSum + Number(deliveryFee || 0)} UAH</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Delivery Info</h3>
          <form
            className="grid grid-cols-1 sm:grid-cols-2 gap-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="">
              <input
                type="text"
                placeholder="Full Name"
                className="border border-gray-300 rounded-xl px-4 py-2 w-full"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1 justify-center flex">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="">
              <input
                type="tel"
                placeholder="Phone Number"
                className="border border-gray-300 rounded-xl px-4 py-2 w-full"
                {...register("phone", {
                  required: "Phone is required",
                  pattern: {
                    value: /^\+?\d{10,15}$/,
                    message: "Invalid phone format",
                  },
                })}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1 justify-center flex">
                  {errors.phone.message}
                </p>
              )}
            </div>
            <div className="">
              <input
                type="text"
                placeholder="City"
                className="border border-gray-300 rounded-xl px-4 py-2 w-full"
                {...register("city", { required: "City is required" })}
              />
              {errors.city && (
                <p className="text-red-500 text-sm mt-1 justify-center flex">
                  {errors.city.message}
                </p>
              )}
            </div>
            <div className="">
              <input
                type="email"
                placeholder="Email"
                className="border border-gray-300 rounded-xl px-4 py-2 w-full"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 justify-center flex">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="sm:col-span-2">
              <input
                type="text"
                placeholder="Street Address"
                className="border border-gray-300 rounded-xl px-4 py-2 w-full col-span-1 sm:col-span-2"
                {...register("address", { required: "Address is required" })}
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1 justify-center flex">
                  {errors.address.message}
                </p>
              )}
            </div>
            <div className="sm:col-span-2">
              <textarea
                placeholder="Additional notes (e.g., floor, entrance code)"
                className="border border-gray-300 rounded-xl px-4 py-2 w-full col-span-1 sm:col-span-2"
                rows="3"
                {...register("notes")}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm text-gray-600">Delivery zone</label>
              <select
                className="border border-gray-300 rounded-xl px-4 py-2 w-full text-gray-700"
                value={selectedZoneId ?? ""}
                onChange={(e) => dispatch(setSelectedZone(e.target.value))}
              >
                {zones.length === 0 ? (
                  <option value="" disabled>
                    No delivery zones available
                  </option>
                ) : null}
                {zones.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.title} — fee {z.deliveryFee ?? 0} ₴, ETA{" "}
                    {z.eta ?? "60-90m"}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2 text-right">
              <Button
                title="Place Order"
                type={
                  "bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-xl transition duration-200 mt-4 w-full"
                }
                isDisabled={false}
                buttonType={"submit"}
                action={() => console.log("submited")}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
