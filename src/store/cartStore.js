import { create } from "zustand";

const useCartStore = create((set) => ({

  cartItems: [],

  addToCart: (product) =>
    set((state) => ({
      cartItems: [...state.cartItems, product],
    })),

}));

export default useCartStore;