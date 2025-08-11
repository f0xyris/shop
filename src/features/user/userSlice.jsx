import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

const initialuser = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

export const fetchUserRole = createAsyncThunk(
  "user/fetchUserRole",
  async (uid, { rejectWithValue }) => {
    try {
      if (!uid) return null;
      const ref = doc(db, "users", uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) return { role: "user" };
      const data = snap.data();
      return { role: data.role || "user" };
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: initialuser,
  },
  reducers: {
    login: (state, { payload }) => {
      // Preserve previously stored role if present
      const next = { ...(state.user || {}), ...payload };
      state.user = next;
      localStorage.setItem("user", JSON.stringify(next));
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserRole.fulfilled, (state, { payload }) => {
      if (!state.user) return;
      const next = { ...state.user, ...(payload || {}) };
      state.user = next;
      localStorage.setItem("user", JSON.stringify(next));
    });
  },
});

export const { login, logout } = userSlice.actions;

export const selectUser = (state) => state.user.user;
export const selectIsAdmin = (state) =>
  (state.user.user?.role || "user") === "admin";

export default userSlice.reducer;
