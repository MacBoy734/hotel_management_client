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
            <PulseLoader color="#36d7b7" size={30} margin={5} />
            <p className="mt-4 text-lg font-medium text-white">Searching Products....</p>
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
    <div className="bg-black text-white">
      <h1 className="text-3xl font-bold mb-6 pl-3">{product?.name}</h1>
      <div className="">
        <div className="m-5">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
            {product?.images.map((image, index) => (
              <div key={index}>
                <img
                  src={image.url || "/placeholder.png"}
                  alt={`${product?.name} - Image ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className='mt-3 p-3'>
          <p className="text-2xl mb-4 ml-5">Price: ${product?.price}</p>
          <p className='text-center my-10 underline text-xl'>product description</p>
          <p className="mb-6 ml-4">{product?.description}</p>

          <button
            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg"
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
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
