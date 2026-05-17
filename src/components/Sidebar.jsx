import useCartStore from "../store/cartStore";

export default function Sidebar() {

  const cartItems = useCartStore((state) => state.cartItems);

  return (
    <div className="w-64 bg-[#171717] border-r border-gray-800 p-4 flex flex-col">

      <h1 className="text-2xl font-bold mb-8">
        AI Shop
      </h1>

      <button className="bg-white text-black rounded-lg py-2 px-4 mb-4">
        + New Chat
      </button>

      <div className="flex flex-col gap-3 text-gray-300">

        <button className="text-left hover:text-white">
          Chat History
        </button>

        <button className="text-left hover:text-white">
          Saved Products
        </button>

        <button className="text-left hover:text-white">
          Cart ({cartItems.length})
        </button>

      </div>

    </div>
  );
}