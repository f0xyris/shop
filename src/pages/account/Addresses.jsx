import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";

export default function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    label: "Home",
    city: "Kyiv",
    street: "",
    comment: "",
  });
  const user = auth.currentUser;

  const load = async () => {
    if (!user) {
      setAddresses([]);
      setLoading(false);
      return;
    }
    try {
      const snap = await getDocs(
        collection(db, "users", user.uid, "addresses")
      );
      setAddresses(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const addAddress = async (e) => {
    e.preventDefault();
    if (!user) return;
    await addDoc(collection(db, "users", user.uid, "addresses"), form);
    setForm({ label: "Home", city: "Kyiv", street: "", comment: "" });
    load();
  };

  const remove = async (id) => {
    if (!user) return;
    await deleteDoc(doc(db, "users", user.uid, "addresses", id));
    load();
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (!user) return <div className="p-4">Sign in to manage addresses</div>;

  return (
    <div className="content w-[100vw] lg:w-[69vw] xl:w-[67vw] p-6">
      <h2 className="text-xl font-semibold mb-4">Addresses</h2>
      <form
        className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4"
        onSubmit={addAddress}
      >
        <input
          className="border border-gray-300 rounded-xl px-4 py-2 w-full"
          placeholder="Label (Home/Office)"
          value={form.label}
          onChange={(e) => setForm({ ...form, label: e.target.value })}
        />
        <input
          className="border border-gray-300 rounded-xl px-4 py-2 w-full"
          placeholder="City"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
        />
        <input
          className="border border-gray-300 rounded-xl px-4 py-2 w-full sm:col-span-2"
          placeholder="Street, house, apt"
          value={form.street}
          onChange={(e) => setForm({ ...form, street: e.target.value })}
        />
        <input
          className="border border-gray-300 rounded-xl px-4 py-2 w-full sm:col-span-2"
          placeholder="Comment (entrance, code)"
          value={form.comment}
          onChange={(e) => setForm({ ...form, comment: e.target.value })}
        />
        <button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-4 py-2 rounded-xl sm:col-span-2">
          Add address
        </button>
      </form>

      <div className="space-y-3">
        {addresses.map((a) => (
          <div
            key={a.id}
            className="border rounded-xl p-3 flex justify-between"
          >
            <div>
              <div className="font-semibold">{a.label}</div>
              <div className="text-sm text-gray-700">
                {a.city}, {a.street}
              </div>
              {a.comment ? (
                <div className="text-xs text-gray-500">{a.comment}</div>
              ) : null}
            </div>
            <button
              className="text-sm text-red-600 hover:underline"
              onClick={() => remove(a.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
