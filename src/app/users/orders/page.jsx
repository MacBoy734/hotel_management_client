"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux"
import { useRouter } from "next/navigation";
import { logout } from "../../../slices/authSlice"
import { PulseLoader } from 'react-spinners'

export default function MyOrdersPage() {
  const { user, isAuthenticated, status } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const router = useRouter()
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status !== "loading" && !isAuthenticated) {
      dispatch(logout)
      toast.error('you need to be logged in!')
      router.push("/auth/login")
    }
  }, [user, status, router])
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/${user._id}/orders`, { credentials: 'include' })
        if (!res.ok) {
          const { error } = await res.json()
          if (res.status === 403) {
            dispatch(logout())
            router.replace('/auth/login')
            toast.error(error)
            return
          }
          setError(error)
          return
        }
        const data = await res.json()
        setOrders(data)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchOrders()
  }, [user])

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-700">My Orders</h1>

      {
        isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[20vh] w-full">
            <PulseLoader color="#36d7b7" size={20} margin={5} />
            <p className="mt-4 text-xl font-bold text-black">Loading....</p>
          </div>) : error ? (
            <p className="text-center col-span-full text-red-500 text-2xl my-14 font-bold">
              ⚠️ {error}
            </p>
          ) : orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="border rounded-lg p-4 bg-white shadow-md"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="font-semibold text-lg">Order #{order._id}</h2>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${order.OrderStatus === "Delivered"
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-600"
                        }`}
                    >
                      {order.OrderStatus}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">
                    Placed on: {order.createdAt}
                  </p>
                  <ul className="space-y-1 mb-2">
                    {order.items.map((item, index) => (
                      <li
                        key={index}
                        className="text-sm text-gray-700 flex justify-between"
                      >
                        <span>{item.name}</span>
                        <span>x{item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-800">
                      Total: {order.totalAmount}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
          <div className="text-center text-gray-500">
            <p>No orders found.</p>
          </div>
        )
      }
    </div>
  );
}
