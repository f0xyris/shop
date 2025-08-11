import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { auth, db } from "../../firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";

const initialFav = localStorage.getItem("fav")
  ? JSON.parse(localStorage.getItem("fav"))
  : [];

export const syncFavoritesFromFirestore = createAsyncThunk(
  "fav/syncFromFirestore",
  async (_, { rejectWithValue }) => {
    try {
      const user = auth.currentUser;
      if (!user) return [];
      const favCol = collection(db, "users", user.uid, "favorites");
      const snapshot = await getDocs(favCol);
      return snapshot.docs.map((d) => d.data());
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const addFavoriteRemote = createAsyncThunk(
  "fav/addFavoriteRemote",
  async (item, { rejectWithValue }) => {
    try {
      const user = auth.currentUser;
      if (!user) return item;
      const ref = doc(
        db,
        "users",
        user.uid,
        "favorites",
        item.id ?? item.title
      );
      await setDoc(ref, item, { merge: true });
      return item;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const deleteFavoriteRemote = createAsyncThunk(
  "fav/deleteFavoriteRemote",
  async (item, { rejectWithValue }) => {
    try {
      const user = auth.currentUser;
      if (!user) return item;
      const ref = doc(
        db,
        "users",
        user.uid,
        "favorites",
        item.id ?? item.title
      );
      await deleteDoc(ref);
      return item;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const favSlice = createSlice({
  name: "fav",
  initialState: {
    fav: initialFav,
  },
  reducers: {
    add: (state, { payload }) => {
      const key = payload.id ?? payload.title;
      const exists = state.fav.some((f) => (f.id ?? f.title) === key);
      if (!exists) state.fav.push(payload);
      localStorage.setItem("fav", JSON.stringify(state.fav));
    },
    del: (state, { payload }) => {
      const key = payload.id ?? payload.title;
      state.fav = state.fav.filter((f) => (f.id ?? f.title) !== key);
      localStorage.setItem("fav", JSON.stringify(state.fav));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(syncFavoritesFromFirestore.fulfilled, (state, { payload }) => {
        state.fav = payload ?? [];
        localStorage.setItem("fav", JSON.stringify(state.fav));
      })
      .addCase(addFavoriteRemote.fulfilled, (state, { payload }) => {
        const key = payload.id ?? payload.title;
        const exists = state.fav.some((f) => (f.id ?? f.title) === key);
        if (!exists) state.fav.push(payload);
        localStorage.setItem("fav", JSON.stringify(state.fav));
      })
      .addCase(deleteFavoriteRemote.fulfilled, (state, { payload }) => {
        const key = payload.id ?? payload.title;
        state.fav = state.fav.filter((f) => (f.id ?? f.title) !== key);
        localStorage.setItem("fav", JSON.stringify(state.fav));
      });
  },
});

export const { add, del } = favSlice.actions;

export const showFavorites = (state) => state.fav.fav;

export default favSlice.reducer;
