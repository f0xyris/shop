import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

const initialState = {
  city: "Kyiv",
  minOrderByCity: {
    Kyiv: 400,
  },
  zones: [],
  selectedZoneId: null,
  deliveryFee: 0,
};

export const fetchZonesByCity = createAsyncThunk(
  "settings/fetchZonesByCity",
  async (cityId = "Kyiv", { rejectWithValue }) => {
    try {
      const zonesCol = collection(db, "cities", cityId, "zones");
      const snap = await getDocs(zonesCol);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setCity: (state, { payload }) => {
      state.city = payload;
      state.selectedZoneId = null;
    },
    setMinOrder: (state, { payload }) => {
      const { city, min } = payload;
      state.minOrderByCity[city] = min;
    },
    setSelectedZone: (state, { payload }) => {
      state.selectedZoneId = payload;
      const zone = state.zones.find((z) => z.id === payload);
      state.deliveryFee = zone?.deliveryFee ?? 0;
      if (zone?.minOrder) {
        state.minOrderByCity[state.city] = zone.minOrder;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchZonesByCity.fulfilled, (state, { payload }) => {
      state.zones = payload ?? [];
      // reset selection
      state.selectedZoneId = payload?.[0]?.id ?? null;
      const zone = payload?.[0];
      state.deliveryFee = zone?.deliveryFee ?? 0;
      if (zone?.minOrder) {
        state.minOrderByCity[state.city] = zone.minOrder;
      }
    });
  },
});

export const { setCity, setMinOrder, setSelectedZone } = settingsSlice.actions;
export const selectCity = (state) => state.settings.city;
export const selectMinOrder = (state) =>
  state.settings.minOrderByCity[state.settings.city] ?? 0;
export const selectZones = (state) => state.settings.zones;
export const selectSelectedZoneId = (state) => state.settings.selectedZoneId;
export const selectDeliveryFee = (state) => state.settings.deliveryFee;

export default settingsSlice.reducer;


