"use client";

import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { state, dispatch } = useCart();

  console.log(state)

  const total = state.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleIncrement = (productId: string) => {
    dispatch({ type: "INCREMENT", payload: { productId } });
  };

  const handleDecrement = (productId: string) => {
    dispatch({ type: "DECREMENT", payload: { productId } });
  };

  const handleRemoveItem = (productId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: {productId} })
  }

  const handleCheckout = () => {
    // Aqui você pode chamar a API para finalizar
    alert("Compra finalizada (simulação)!");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Carrinho de Compras</h1>

      {state.items.length === 0 ? (
        <p>Carrinho vazio.</p>
      ) : (
        <ul>
          {state.items.map((item) => (
            <li key={item.productId} className="mb-4 flex items-center gap-4 border-b pb-4">
              {item.imageUrl && (
                <img src={item.imageUrl} alt={item.name} className="h-16 w-16 rounded object-cover" />
              )}
              <div className="flex-1">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-zinc-600">R$ {Number(item.price).toFixed(2)} cada</p>

                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={() => handleDecrement(item.productId)}
                    className="px-2 py-1 bg-zinc-200 rounded"
                  >
                    –
                  </button>
                  <span className="font-medium">{item.quantity}</span>
                  <button
                    onClick={() => handleIncrement(item.productId)}
                    className="px-2 py-1 bg-zinc-200 rounded"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="font-bold">
                R$ {(Number(item.price) * item.quantity).toFixed(2)}
              </div>
              <div onClick={() => handleRemoveItem(item.productId)} className="h-[100px] flex items-baseline">
                <span className="text-2xl">X</span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {state.items.length > 0 && (
        <div className="mt-6 flex justify-between items-center">
          <p className="text-lg font-bold">Total: R$ {total.toFixed(2)}</p>
          <button
            onClick={handleCheckout}
            className="bg-primary text-white px-6 py-2 rounded-xl transition"
          >
            Finalizar Compra
          </button>
        </div>
      )}
    </div>
  );
}
