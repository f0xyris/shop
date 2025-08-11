import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { selectIsAdmin } from "../../features/user/userSlice";
import { db, storage } from "../../firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FiUpload } from "react-icons/fi";
import { useSearchParams } from "react-router-dom";

const CATALOGS = ["rolls", "sushi", "sets", "snacks", "drinks", "sauces"];

export default function AdminProducts() {
  const isAdmin = useSelector(selectIsAdmin);
  const [searchParams] = useSearchParams();
  const demoMode =
    searchParams.get("demo") === "1" ||
    localStorage.getItem("demoMode") === "1";
  const [catalog, setCatalog] = useState(CATALOGS[0]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null); // null | item object
  const [form, setForm] = useState({
    title: "",
    price: "",
    weight: "",
    desc: "",
    image: "",
    isNew: false,
    isTop: false,
    spicy: false,
    eco: false,
  });
  const [file, setFile] = useState(null);
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const dropped = e.dataTransfer?.files?.[0] || null;
    if (dropped) setFile(dropped);
  };

  const canSubmit = useMemo(() => {
    return Boolean(form.title && form.price && (form.image || file));
  }, [form, file]);

  // Demo storage helpers (localStorage)
  const readDemo = () => {
    try {
      const raw = localStorage.getItem(`demo:${catalog}`);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };
  const writeDemo = (arr) => {
    localStorage.setItem(`demo:${catalog}`, JSON.stringify(arr));
  };
  const fileToDataUrl = (f) =>
    new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(r.result);
      r.onerror = rej;
      r.readAsDataURL(f);
    });

  const load = async () => {
    setLoading(true);
    try {
      // Always read live snapshot (public read) as base
      const snap = await getDocs(collection(db, catalog));
      const base = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

      if (demoMode) {
        let local = readDemo();
        if (!local || local.length === 0) {
          // Initialize local demo data from live snapshot
          writeDemo(base);
          local = base;
        }
        setItems(local.map((d) => ({ ...d, collectionName: catalog })));
      } else {
        setItems(base.map((d) => ({ ...d, collectionName: catalog })));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catalog]);

  const resetForm = () => {
    setEditing(null);
    setForm({
      title: "",
      price: "",
      weight: "",
      desc: "",
      image: "",
      isNew: false,
      isTop: false,
      spicy: false,
      eco: false,
    });
    setFile(null);
  };

  const onEdit = (item) => {
    setEditing(item);
    setForm({
      title: item.title || "",
      price: item.price || "",
      weight: item.weight || "",
      desc: item.desc || "",
      image: item.image || "",
      isNew: !!item.isNew,
      isTop: !!item.isTop,
      spicy: !!item.spicy,
      eco: !!item.eco,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    if (demoMode) {
      const list = readDemo();
      const id =
        editing?.id || `${Date.now()}_${Math.random().toString(36).slice(2)}`;
      let imageUrl = form.image;
      if (file) {
        imageUrl = await fileToDataUrl(file);
      }
      const payload = {
        id,
        title: form.title,
        price: Number(form.price),
        weight: Number(form.weight) || undefined,
        desc: form.desc,
        image: imageUrl,
        isNew: !!form.isNew,
        isTop: !!form.isTop,
        spicy: !!form.spicy,
        eco: !!form.eco,
      };
      const next = editing
        ? list.map((x) => (x.id === id ? { ...x, ...payload } : x))
        : [...list, payload];
      writeDemo(next);
      resetForm();
      await load();
      return;
    }
    if (!isAdmin) return; // production mode requires admin
    let imageUrl = form.image;
    if (file) {
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
      const objectPath = `products/${catalog}/${Date.now()}_${Math.random()
        .toString(36)
        .slice(2)}.${ext}`;
      const storageRef = ref(storage, objectPath);
      await uploadBytes(storageRef, file);
      imageUrl = await getDownloadURL(storageRef);
    }
    const payload = {
      title: form.title,
      price: Number(form.price),
      weight: Number(form.weight) || undefined,
      desc: form.desc,
      image: imageUrl,
      isNew: !!form.isNew,
      isTop: !!form.isTop,
      spicy: !!form.spicy,
      eco: !!form.eco,
    };
    if (editing?.id) {
      await setDoc(doc(db, catalog, editing.id), payload, { merge: true });
    } else {
      await addDoc(collection(db, catalog), payload);
    }
    resetForm();
    await load();
  };

  const onDelete = async (item) => {
    if (!item?.id) return;
    if (!window.confirm(`Delete ${item.title}?`)) return;
    if (demoMode) {
      const list = readDemo().filter((x) => x.id !== item.id);
      writeDemo(list);
    } else {
      if (!isAdmin) return;
      await deleteDoc(doc(db, catalog, item.id));
    }
    if (editing?.id === item.id) resetForm();
    await load();
  };

  if (!isAdmin && !demoMode) {
    return (
      <div className="content pl-[4.5rem]! md:pl-[6.5rem]! w-[calc(100vw-3.5rem)] md:w-[calc(100vw-3rem)] lg:w-[66vw] xl:w-[65vw]">
        Access denied
      </div>
    );
  }

  return (
    <div className="content pl-[4.5rem]! md:pl-[6.5rem]! w-[calc(100vw-1rem)] md:w-[calc(100vw-3rem)] lg:w-[66vw] xl:w-[65vw]">
      <h1 className="text-2xl font-bold mb-4">Admin: Products</h1>
      {demoMode ? (
        <div className="mb-4 p-3 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
          Demo mode: all changes are concentrated only in your browser
          (localStorage) and data resources are not taken into account.
        </div>
      ) : null}

      <div className="flex flex-col md:flex-row gap-4 md:items-center mb-4">
        <select
          className="border rounded-lg px-3 py-2"
          value={catalog}
          onChange={(e) => setCatalog(e.target.value)}
        >
          {CATALOGS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button
          className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
          onClick={resetForm}
        >
          New product
        </button>
      </div>

      <form
        onSubmit={onSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-white rounded-xl shadow p-4 mb-6"
      >
        <input
          className="border rounded-lg px-3 py-2"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          className="border rounded-lg px-3 py-2"
          placeholder="Price (uah)"
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <input
          className="border rounded-lg px-3 py-2"
          placeholder="Weight (g)"
          type="number"
          value={form.weight}
          onChange={(e) => setForm({ ...form, weight: e.target.value })}
        />
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
          <label
            className="flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-4 cursor-pointer hover:border-amber-400 transition-colors"
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <FiUpload className="text-2xl text-gray-600" />
            <span className="text-sm text-gray-700">
              Выберите файл или перетащите сюда
            </span>
            <span className="text-xs text-gray-500">PNG/JPG, до 5MB</span>
            {file ? (
              <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                {file.name}
              </span>
            ) : null}
          </label>
          <div className="w-full">
            <div className="text-xs text-gray-500 mb-1">или вставьте URL:</div>
            <input
              className="w-full border rounded-lg px-3 py-2"
              placeholder="https://..."
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
            />
          </div>
        </div>
        {file ? (
          <div className="md:col-span-2">
            <div className="text-sm text-gray-600 mb-1">Предпросмотр:</div>
            <img
              className="w-32 h-32 object-contain border rounded-lg"
              src={URL.createObjectURL(file)}
              alt="preview"
            />
          </div>
        ) : form.image ? (
          <div className="md:col-span-2">
            <div className="text-sm text-gray-600 mb-1">
              Текущее изображение:
            </div>
            <img
              className="w-32 h-32 object-contain border rounded-lg"
              src={form.image}
              alt="current"
            />
          </div>
        ) : null}
        <textarea
          className="border rounded-lg px-3 py-2 md:col-span-2"
          placeholder="Description"
          rows={3}
          value={form.desc}
          onChange={(e) => setForm({ ...form, desc: e.target.value })}
        />

        <div className="flex gap-4 md:col-span-2">
          {[
            ["isNew", "New"],
            ["isTop", "Top"],
            ["spicy", "Spicy"],
            ["eco", "Eco"],
          ].map(([key, label]) => (
            <label key={key} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>

        <div className="md:col-span-2 flex gap-3">
          <button
            type="submit"
            disabled={!canSubmit}
            className={`px-4 py-2 rounded-lg text-white ${
              canSubmit ? "bg-emerald-600 hover:bg-emerald-700" : "bg-gray-400"
            }`}
          >
            {editing ? "Save changes" : "Add product"}
          </button>
          {editing ? (
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
              onClick={resetForm}
            >
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      <div className="bg-white rounded-xl shadow mt-6!">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="font-semibold">Products in {catalog}</div>
          <div className="text-sm text-gray-500">
            {loading ? "Loading..." : `${items.length} items`}
          </div>
        </div>
        <div className="divide-y">
          {items.map((it) => (
            <div
              key={it.id}
              className="flex items-center gap-3 px-4 py-3 flex-wrap md:flex-nowrap"
            >
              <img
                src={it.image}
                alt={it.title}
                className="w-16 h-16 object-contain flex-none"
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium line-clamp-2">{it.title}</div>
                <div className="text-sm text-gray-600">
                  {it.weight ? `${it.weight} g · ` : ""}
                  {it.price} uah
                </div>
              </div>
              <div className="ml-auto flex gap-2 w-full md:w-auto justify-end mt-2 md:mt-0">
                <button
                  className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm md:text-base"
                  onClick={() => onEdit(it)}
                >
                  Edit
                </button>
                <button
                  className="px-3 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 text-sm md:text-base"
                  onClick={() => onDelete(it)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && !loading ? (
            <div className="px-4 py-6 text-center text-gray-500">No items</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
