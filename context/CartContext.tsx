"use client";

import { createContext, useReducer, useContext, useEffect } from "react";
import { CartAction, CartState } from "@/types/cart";
import { cartReducer } from "@/reducers/cartReducer";

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
}>({ state: { items: [] }, dispatch: () => null });

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const initialState: CartState = {
    items: [],
  };

  const [state, dispatch] = useReducer(cartReducer, initialState);
  // Carregar do localStorage
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      dispatch({ type: "SET_CART", payload: JSON.parse(stored) });
    }
  }, []);

  // Salvar no localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.items));
  }, [state.items]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
