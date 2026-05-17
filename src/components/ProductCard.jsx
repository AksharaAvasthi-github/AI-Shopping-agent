import useCartStore from "../store/cartStore";

export default function ProductCard({ product }) {

  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden border border-gray-800">

      <img
        src={product.image}
        alt={product.name}
        className="w-full h-52 object-cover"
      />

      <div className="p-4">

        <h2 className="text-xl font-semibold mb-2">
          {product.name}
        </h2>

        <p className="text-gray-300 mb-1">
          {product.price}
        </p>

        <p className="text-yellow-400 mb-4">
          ⭐ {product.rating}
        </p>

        <div className="flex gap-3">

          <button
            onClick={() => addToCart(product)}
            className="bg-white text-black px-4 py-2 rounded-xl font-medium"
          >
            Add to Cart
          </button>

          <button className="border border-gray-600 px-4 py-2 rounded-xl">
            Buy Now
          </button>

        </div>

      </div>

    </div>
  );
}