import { CartState, CartAction } from "@/types/cart";

export const cartReducer = (
  state: CartState,
  action: CartAction
): CartState => {
  switch (action.type) {
    case "SET_CART":
      return { items: action.payload };

    case "ADD_ITEM":
      const exists = state.items.find(
        (i) => i.productId === action.payload.productId
      );
      if (exists) {
        return {
          items: state.items.map((i) =>
            i.productId === action.payload.productId
              ? { ...i, quantity: i.quantity + action.payload.quantity }
              : i
          ),
        };
      }
      return { items: [...state.items, action.payload] };

    case "REMOVE_ITEM":
      return {
        items: state.items.filter(
          (i) => i.productId !== action.payload.productId
        ),
      };

    case "CLEAR_CART":
      return { items: [] };

    case "INCREMENT":
      return {
        items: state.items.map((i) =>
          i.productId === action.payload.productId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        ),
      };

    case "DECREMENT":
      return {
        items: state.items
          .map((i) =>
            i.productId === action.payload.productId
              ? { ...i, quantity: i.quantity - 1 }
              : i
          )
          .filter((i) => i.quantity > 0), // Remove do carrinho se quantidade ficar 0
      };

    default:
      return state;
  }
};
