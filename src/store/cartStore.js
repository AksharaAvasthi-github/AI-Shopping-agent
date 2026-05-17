import { create } from "zustand";

const useCartStore = create((set) => ({

  cartItems: [],

  addToCart: (product) =>
    set((state) => ({
      cartItems: [...state.cartItems, product],
    })),

  removeFromCart: (indexToRemove) =>
    set((state) => ({
      cartItems: state.cartItems.filter(
        (_, index) => index !== indexToRemove
      ),
    })),

}));

export default useCartStore;