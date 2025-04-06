// pages/checkout.js
"use client"
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux"
import { useRouter } from "next/navigation";
import { logout } from "../../slices/authSlice"
import { toast } from "react-toastify";
import { PulseLoader } from 'react-spinners'

const placeOrderPage = () => {
  const cart = useSelector((state) => state.cart)
  const dispatch = useDispatch()
  const { user, status, isAuthenticated } = useSelector((state) => state.auth)
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [unavailableItems, setUnavailableItems] = useState([])
  const [formData, setFormData] = useState({
    name: user?.username || "",
    phone: user?.phone || "",
    email: user?.email || "",
    paymentMethod: "M-Pesa"
  });
  const [isHydrated, setIsHydrated] = useState(false)
  useEffect(() => {
    if (status !== "loading" && !isAuthenticated) {
      toast.error('you need to be logged in!')
      router.replace("/auth/login")
    }
  }, [user, status, router])
  useEffect(() => {
    setIsHydrated(true)
    setFormData((prevData) => ({
      ...prevData,
      userId: user?._id || "",
      items: cart?.cartItems || [],
    }))
  }, [cart.cartItems, user])
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if(formData.items.length === 0){
        toast.error("your Basket cannot be empty!")
        return
      }
      setIsSubmitting(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/foods/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: 'include'
      })
      if (!response.ok) {
        const { error, unavailableItems } = await response.json()
        if (response.status === 403) {
          dispatch(logout())
          router.replace('/auth/login')
          toast.error(error)
          return
        }
        if(unavailableItems.length > 0){
          setUnavailableItems(unavailableItems)
        }
        toast.error(error)
        return
      }
      router.push('/users/orders')
      toast.success('order completed!')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  };

  if (!isHydrated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
        <PulseLoader color="#36d7b7" size={20} margin={5} />
        <p className="mt-4 text-xl font-bold text-black">Loading....</p>
      </div>
    )
  }

  return (
    <div className="p-4 mt-16">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-8">
          Checkout
        </h1>
        {
              unavailableItems.length > 0 && (
                <div className="my-6">
                  <p className="text-red-500 font-semibold">please fix the following items in your basket before proceeding! Remove all items in this list from the basket, go to the menu page and add them again if they are available.</p>
                  <ul>
                    {
                      unavailableItems.map((item, index) => (
                        <li key={index} className="text-lg ml-5">- {item.name} -- {item.reason}</li>
                      ))
                    }
                  </ul>
                </div>
              )
            }

        <form onSubmit={handleSubmit}>
          {/* Personal Information */}
          <div className="mb-6">
            <label
              htmlFor="name"
              className="block text-gray-700 font-medium mb-2"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="phone"
              className="block text-gray-700 font-medium mb-2"
            >
              Phone Number
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Order Summary */}
          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Order Summary</h2>
            {cart.cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4"
              >
                <h2 className="text-lg text-black">{item.name} - ({item.quantity})</h2>

                <p className="text-sm text-gray-600">${item.price.toFixed(2)}</p>
              </div>
            ))}
            <div className="flex justify-between font-bold text-black p-4">
              <p>Total</p>
              <p>==</p>
              <p>${cart.totalPrice}</p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Payment Method
            </label>
            <select
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            >
              <option value="M-Pesa">M-Pesa</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isSubmitting && 'opacity-50'}`}
            >
              {isSubmitting ? 'Processing Order...' : 'Complete Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default placeOrderPage;
