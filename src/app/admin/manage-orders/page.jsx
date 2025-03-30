"use client"
import { React, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux"
import Link from "next/link";
import { logout } from "../../../slices/authSlice"
import { PulseLoader } from "react-spinners"
import { toast } from "react-toastify";


const ManageOrders = () => {
    const dispatch = useDispatch()
    const router = useRouter()
    const [orders, setOrders] = useState([])
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [totalAmount, setTotalAmount] = useState('')
    const [paymentStatus, setPaymentStatus] = useState('')
    const [orderStatus, setOrderStatus] = useState('')
    const [currentId, setCurrentId] = useState('')
    const [isSavingOrder, setIsSavingOrder] = useState(false)

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setIsLoading(true)
                const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/orders`, { credentials: 'include' });
                if (!response.ok) {
                    const { error } = await response.json()
                    if (response.status === 403) {
                        dispatch(logout())
                        router.replace('/unauthorized')
                        toast.error(error)
                        return
                    }
                    setError(error)
                    return
                }
                const data = await response.json();
                setOrders(data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setIsLoading(false)
            }
        };
        fetchOrders();
    }, []);


    const handleCloseModal = () => {
        setTotalAmount('')
        setPaymentStatus('')
        setOrderStatus('')
        setCurrentId('')
        setIsModalOpen(false)
    }

    const handleEditOrder = (order) => {
        setOrderStatus(order.orderStatus)
        setPaymentStatus(order.paymentStatus)
        setCurrentId(order._id)
        setTotalAmount(order.totalAmount);
        setIsModalOpen(true);
    }

    // Save edited order
    const handleSaveOrder = async () => {
        if (!paymentStatus || !orderStatus || !totalAmount || !currentId) {
            toast.error('fill in all fields!')
            return
        }
        try {
            setIsSavingOrder(true)
            const order = {
                paymentStatus,
                orderStatus
            }
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/orders/editorder/${currentId}`, {
                method: 'PATCH',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(order),
                credentials: 'include',
            })
            if (!response.ok) {
                const { error } = await response.json()
                if (response.status === 403) {
                    dispatch(logout())
                    router.replace('/unauthorized')
                    toast.error(error)
                    return
                }
                toast.error(error)
                return
            }
            const data = await response.json()
            setOrders(orders.map((order) => (order._id === data._id ? data : order)));
            setTotalAmount('')
            setPaymentStatus('')
            setOrderStatus('')
            setCurrentId('')
            toast.success('order updated')
            setIsModalOpen(false);
        } catch (error) {
            toast.error(error.message)
        } finally {
            setIsSavingOrder(false)
        }
    };

    const handleDeleteOrder = async (id) => {
        if (confirm('delete this order?')) {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/orders/deleteorder/${id}`, { method: 'DELETE', credentials: 'include' })
                if (!response.ok) {
                    const { error } = await response.json()
                    if (response.status === 403) {
                        dispatch(logout())
                        router.replace('/unauthorized')
                        toast.error(error)
                        return
                    }
                    toast.error(error)
                    return
                }
                setOrders(orders.filter(order => order._id !== id))
                toast.success('order deleted')
            } catch (error) {
                toast.error(error.message)
            }
        }
    };

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen text-black">
            <h1 className="text-3xl font-bold text-gray-800">Manage Orders</h1>

            {
                isLoading ? (
                    <div className={`flex flex-col items-center justify-center min-h-[60vh]`}>
                        <PulseLoader color="#36d7b7" size={30} margin={5} />
                        <p className="mt-4 text-lg font-medium text-black">Loading Orders...</p>
                    </div>
                ) : error ? (
                    <p className="text-center col-span-full text-red-500 text-2xl mt-20 font-bold">
                        ⚠️ {error}
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-auto-fit gap-6">
                            {orders.length > 0 ? (
                                orders.map((order) => (
                                    <div key={order._id} className="p-6 bg-white shadow-md rounded-xl border w-full max-w-2xl mx-auto">
                                        <p className="text-xl font-semibold">User: {order.user.username}</p>
                                        <p className="text-md text-gray-600">User Email: {order.email}</p>
                                        <p className="text-md">Total: ${order.totalAmount}</p>
                                        <p className="text-md">User Id: {order.user._id}</p>
                                        <p className="text-md text-gray-600">Order Id: {order._id}</p>
                                        <p className="text-md text-gray-600">Payment Method: {order.paymentMethod}</p>
                                        <p className="text-md text-gray-600">Created At: {new Date(order.createdAt).toLocaleString()}</p>
                                        <p className="text-md">
                                            Payment Status: <span className="font-medium">{order.paymentStatus}</span>
                                        </p>
                                        <p className="text-md">
                                            Order Status: <span className="font-medium">{order.orderStatus}</span>
                                        </p>

                                        {/* Display Ordered Items */}
                                        <div className="mt-4">
                                            <p className="text-lg font-semibold">Items Ordered:</p>
                                            <ul className="list-disc list-inside text-gray-700">
                                                {order.items.map((item, index) => (
                                                    <li key={index} className="ml-4"><Link href={`/foods/${item.product}`} className="text-blue-600">{item.name}</Link> - {item.quantity}</li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="flex justify-between mt-4">
                                            <button
                                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                                onClick={() => handleEditOrder(order)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                                onClick={() => handleDeleteOrder(order._id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 col-span-full">No orders found.</p>
                            )}
                        </div>

                    </div>
                )
            }

            {/* EDIT OFFER MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h3 className="text-lg font-semibold mb-2">Edit Offer</h3>
                        <div className="space-y-3">
                            <label htmlFor="totalAmount" className="mt-3 text-lg">total Amount</label>
                            <input type="text" required id="totalAmount" name="totalAmount" placeholder="Total amount" className="w-full p-2 border border-gray-300 rounded opacity-50" disabled value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} />
                            <label htmlFor="paymentStatus" className="mt-3 text-lg">Payment Status</label>
                            <select
                                className="w-full p-2 border rounded mb-2"
                                value={paymentStatus}
                                id="paymentStatus"
                                onChange={(e) => {
                                    setPaymentStatus(e.target.value)
                                }
                                }
                            >
                                <option value="Pending">Pending</option>
                                <option value="Paid">Paid</option>
                                <option value="Failed">Failed</option>
                            </select>
                            <label htmlFor="orderStatus" className="mt-3 text-lg">Order Status</label>
                            <select
                                className="w-full p-2 border rounded mb-2"
                                value={orderStatus}
                                id="orderStatus"
                                onChange={(e) => {
                                    setOrderStatus(e.target.value)
                                }
                                }
                            >
                                <option value="Pending">Pending</option>
                                <option value="Delivered">Delivered</option>
                            </select>
                        </div>
                        <div className="flex justify-end mt-4 space-x-2">
                            <button className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500" onClick={handleCloseModal}>Cancel</button>
                            <button className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${isSavingOrder && 'opacity-50'}`} onClick={handleSaveOrder} disabled={isSavingOrder}>{isSavingOrder ? 'saving order...' : 'Save Order'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageOrders;
