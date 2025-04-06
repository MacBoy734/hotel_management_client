"use client"
import { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import { useParams } from "next/navigation"
import { toast } from 'react-toastify';
import { addToCart } from '../../../slices/cartSlice';
import { PulseLoader } from 'react-spinners'

const ProductPage = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const [product, setProduct] = useState(null)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/foods/${id}`);
        if (!res.ok) {
          const { error } = await res.json()
          setError(error)
          return
        }
        const data = await res.json()
        setProduct(data)
      } catch (error) {
        toast.error(error.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProduct()
  }, [id])


  const handleAddToCart = (id, name, price, totalQuantity, images) => {
    const item = {
      id,
      name,
      price,
      totalQuantity,
      quantity: 1,
      images
    }
    return dispatch(addToCart(item))
  }

  if (isLoading) {
    return (
        <div className={`flex flex-col items-center justify-center min-h-[60vh]`}>
            <PulseLoader color="#36d7b7" size={20} margin={5} />
            <p className="mt-4 text-lg font-medium text-white">Loading Product....</p>
        </div>
    )
}

  if (error) {
    return (
        <div className={`flex flex-col items-center justify-center min-h-[60vh]`}>
            <p className="text-center col-span-full text-red-500 text-2xl mt-20 font-bold">⚠️ {error}</p>
        </div>
    )
}

return (
  <div className="bg-gray-900 text-white min-h-screen p-6 mt-3">
    <div className="max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-4 text-center my-3">{product?.name}</h1>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <div className="border border-gray-700 rounded-lg overflow-hidden">
            <img
              src={product?.images[0]?.url || "/placeholder.png"}
              alt={product?.name}
              className="w-full h-80 object-cover"
            />
          </div>
          <div className="flex gap-3 mt-4">
            {product?.images.map((image, index) => (
              <img
                key={index}
                src={image.url || "/placeholder.png"}
                alt={`${product?.name} - ${index + 1}`}
                className="w-20 h-20 object-cover border border-gray-600 rounded-lg cursor-pointer hover:scale-105 transition"
              />
            ))}
          </div>
        </div>

        <div className="md:w-1/2 flex flex-col justify-center">
          <p className="text-3xl font-semibold text-blue-400">${product?.price}</p>

          <p className="text-lg text-gray-300 mt-4 leading-relaxed">
            {product?.description}
          </p>
          <button
            className="mt-6 bg-blue-600 hover:bg-blue-500 text-white py-3 px-6 rounded-lg text-lg font-semibold transition shadow-md"
            onClick={(e) => {
              e.preventDefault();
              handleAddToCart(
                product?._id,
                product?.name,
                product?.price,
                product?.quantity,
                product?.images
              );
            }}
          >
            Add to Basket
          </button>
        </div>
      </div>
    </div>
  </div>
);
};

export default ProductPage;
