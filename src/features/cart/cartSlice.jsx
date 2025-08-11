import { createSlice } from "@reduxjs/toolkit";

const initialCart = localStorage.getItem("cartItems")
  ? JSON.parse(localStorage.getItem("cartItems"))
  : [];

const initialProducts = [];

export const cartSlice = createSlice({
  name: "cartItems",
  initialState: {
    cartItems: initialCart,
    productItems: initialProducts,
    isOpen: false,
    isLoading: false,
  },
  reducers: {
    setCartLoading: (state, { payload }) => {
      state.isLoading = Boolean(payload);
    },
    addManyToCart: (state, { payload }) => {
      // payload: array of items {id,title,image,unitPrice,count}
      const drafts = [...state.cartItems];
      for (const p of payload) {
        const productId = p.id ?? p.title;
        const unitPrice = Number(p.unitPrice ?? p.price ?? 0);
        const index = drafts.findIndex(({ id, title }) =>
          id ? id === productId : title === p.title
        );
        const existing = drafts[index];

        const toAddCount = Number(p.count ?? 1);
        if (existing) {
          const newCount = existing.count + toAddCount;
          drafts.splice(index, 1, {
            ...existing,
            count: newCount,
            unitPrice,
            lineTotal: unitPrice * newCount,
            image: p.image ?? existing.image,
          });
        } else {
          drafts.push({
            id: productId,
            title: p.title,
            image: p.image,
            unitPrice,
            count: toAddCount,
            lineTotal: unitPrice * toAddCount,
          });
        }
      }
      state.cartItems = drafts;
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    addToCart: (state, { payload }) => {
      const productId = payload.id ?? payload.title;
      const unitPrice = Number(payload.unitPrice ?? payload.price ?? 0);

      const itemIndex = state.cartItems.findIndex(({ id, title }) => {
        if (id && productId) return id === productId;
        // As a last resort (legacy items without id), also compare unitPrice to distinguish variants
        return (
          title === payload.title &&
          Number(unitPrice) ===
            Number(
              state.cartItems.find((ci) => ci.title === payload.title)
                ?.unitPrice
            )
        );
      });
      const existing = state.cartItems[itemIndex];

      const newItem = existing
        ? {
            ...existing,
            count: existing.count + 1,
            unitPrice,
            lineTotal: unitPrice * (existing.count + 1),
          }
        : {
            id: productId,
            title: payload.title,
            image: payload.image,
            unitPrice,
            count: 1,
            lineTotal: unitPrice,
          };

      if (itemIndex >= 0) {
        state.cartItems.splice(itemIndex, 1, newItem);
      } else {
        state.cartItems.push(newItem);
      }

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    delCounter: (state, { payload }) => {
      const productId = payload.id ?? payload.title;
      const unitPrice = Number(payload.unitPrice ?? payload.price ?? 0);

      const itemIndex = state.cartItems.findIndex(
        ({ id, title, unitPrice: up }) => {
          if (id && productId) return id === productId;
          return title === payload.title && Number(up) === Number(unitPrice);
        }
      );
      const existing = state.cartItems[itemIndex];

      if (!existing) return;

      if (existing.count > 1) {
        const updated = {
          ...existing,
          count: existing.count - 1,
          unitPrice,
          lineTotal: unitPrice * (existing.count - 1),
        };
        state.cartItems.splice(itemIndex, 1, updated);
      } else {
        state.cartItems.splice(itemIndex, 1);
      }
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    delFromCart: (state, { payload }) => {
      const productId = payload.id ?? payload.title;
      state.cartItems = state.cartItems.filter(({ id, title }) =>
        id ? id !== productId : title !== payload.title
      );
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    addProducts: (state, { payload }) => {
      const seen = new Set(state.productItems.map((p) => p.id ?? p.title));
      payload.forEach((item) => {
        const key = item.id ?? item.title;
        if (!seen.has(key)) {
          state.productItems.push(item);
          seen.add(key);
        }
      });
    },
    toggleCart: (state, action) => {
      if (typeof action.payload === "boolean") {
        state.isOpen = action.payload;
      } else {
        state.isOpen = !state.isOpen;
      }
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.setItem("cartItems", JSON.stringify([]));
    },
  },
});

export const {
  addToCart,
  addManyToCart,
  delFromCart,
  delCounter,
  addProducts,
  toggleCart,
  clearCart,
  setCartLoading,
} = cartSlice.actions;

export const showCartItems = (state) => state.cartItems.cartItems;
export const showAllProducts = (state) => state.cartItems.productItems;
export const isCartOpened = (state) => state.cartItems.isOpen;
export const isCartLoading = (state) => state.cartItems.isLoading;

export default cartSlice.reducer;
