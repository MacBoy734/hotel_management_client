"use client";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { FiUsers, FiShoppingCart, FiDollarSign, FiMail, FiList, FiSettings, FiUserPlus, FiCoffee } from "react-icons/fi";
import Link from "next/link";
import { logout } from "../../slices/authSlice";
import { toast } from "react-toastify";

const Dashboard = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const [orders, setOrders] = useState();
  const [revenue, setRevenue] = useState(5400);
  const [customers, setCustomers] = useState();
  const [newsletters, setNewsletters] = useState(1200);
  const [loading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [foods, setFoods] = useState();
  const [newUsers, setNewUsers] = useState(30);
  const [menuUpdates, setMenuUpdates] = useState(10);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/admin/sitedetails`, { credentials: 'include' })
        if (!res.ok) {
          const { error } = await res.json()
          if (res.status === 403) {
            dispatch(logout())
            router.replace('/unauthorized')
            toast.error(error)
            return
          }
          setError(error)
          toast.error(error)
          return
        }
        const data = await res.json()
        setOrders(data.totalOrders)
        setCustomers(data.totalCustomers)
      } catch (error) {
        toast.error(error.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDetails()
  }, [])

  const data = [
    { name: "Jan", sales: 100 },
    { name: "Feb", sales: 150 },
    { name: "Mar", sales: 120 },
    { name: "Apr", sales: 180 },
    { name: "May", sales: 200 },
    { name: "Jun", sales: 250 },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Link href="/admin/manage-orders" className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
          <FiShoppingCart className="text-4xl text-blue-500" />
          <div>
            <h2 className="text-xl font-semibold">Total Orders</h2>
            <p className="text-gray-600 text-lg">{loading ? "Loading..." : error ? "Error!" : orders}</p>
          </div>
        </Link>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
          <FiDollarSign className="text-4xl text-green-500" />
          <div>
            <h2 className="text-xl font-semibold">Revenue</h2>
            <p className="text-gray-600 text-lg">${revenue}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
          <FiUsers className="text-4xl text-purple-500" />
          <div>
            <h2 className="text-xl font-semibold">Customers</h2>
            <p className="text-gray-600 text-lg">{loading ? "Loading..." : error ? "Error!" : customers}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
          <FiMail className="text-4xl text-red-500" />
          <div>
            <h2 className="text-xl font-semibold">Newsletters</h2>
            <p className="text-gray-600 text-lg">{newsletters}</p>
          </div>
        </div>
        <Link href="/admin/manage-foods" className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4 cursor-pointer hover:bg-gray-100">
          <FiList className="text-4xl text-yellow-500" />
          <div>
            <h2 className="text-xl font-semibold">Manage Foods</h2>
            <p className="text-gray-600 text-lg">{foods}</p>
          </div>
        </Link>
        <Link href="/admin/settings" className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4 cursor-pointer hover:bg-gray-100">
          <FiSettings className="text-4xl text-gray-500" />
          <div>
            <h2 className="text-xl font-semibold">Settings</h2>
            <p className="text-gray-600 text-lg">Manage Site</p>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Link href="/admin/manage-users" className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4 cursor-pointer hover:bg-gray-100">
          <FiUserPlus className="text-4xl text-indigo-500" />
          <div>
            <h2 className="text-xl font-semibold">Manage Users</h2>
            <p className="text-gray-600 text-lg">{newUsers}</p>
          </div>
        </Link>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
          <FiCoffee className="text-4xl text-brown-500" />
          <div>
            <h2 className="text-xl font-semibold">Menu Updates</h2>
            <p className="text-gray-600 text-lg">{menuUpdates}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Sales Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="#8884d8" />
            <YAxis stroke="#8884d8" />
            <Tooltip />
            <Bar dataKey="sales" fill="#4F46E5" barRadius={5} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
