export default function ComparisonModal({
  products,
  onClose,
}) {

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6">

      <div className="bg-[#171717] border border-gray-800 rounded-3xl w-full max-w-5xl p-8 relative">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl"
        >
          ✕
        </button>

        <h1 className="text-3xl font-bold mb-8 text-white">
          Product Comparison
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {products.map((product, index) => (

            <div
              key={index}
              className="bg-[#1f1f1f] rounded-2xl overflow-hidden border border-gray-700"
            >

              <img
                src={product.image}
                alt={product.name}
                className="w-full h-64 object-cover"
              />

              <div className="p-6">

                <h2 className="text-2xl font-bold mb-4 text-white">
                  {product.name}
                </h2>

                <div className="space-y-3 text-gray-300">

                  <p>
                    <span className="font-semibold text-white">
                      Price:
                    </span>{" "}
                    {product.price}
                  </p>

                  <p>
                    <span className="font-semibold text-white">
                      Rating:
                    </span>{" "}
                    ⭐ {product.rating}
                  </p>

                  <p>
                    <span className="font-semibold text-white">
                      Category:
                    </span>{" "}
                    Electronics
                  </p>

                  <p>
                    <span className="font-semibold text-white">
                      Delivery:
                    </span>{" "}
                    2-3 Days
                  </p>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}