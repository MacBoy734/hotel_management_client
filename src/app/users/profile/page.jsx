"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { ClipLoader } from 'react-spinners'

const ProfilePage = () => {
  const { user, status, isAuthenticated } = useSelector((state) => state.auth)
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
  })

  useEffect(() => {
    if (status !== "loading" && !isAuthenticated) {
      router.push("/auth/login")
    }
  }, [status, isAuthenticated, router])

  const handleEditToggle = () => {
    setIsEditing(!isEditing)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsEditing(false)
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
        <ClipLoader color="#36d7b7" size={60} margin={5} />
        <p className="mt-4 text-xl font-bold text-black">Loading Profile....</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">

      {/* Edit Profile Form */}
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4 mb-8 text-black">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.username}
              disabled
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 opacity-50"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 opacity-50"
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone number</label>
            <input
              type="text"
              id="phone"
              name="phone"
              disabled
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 opacity-50"
              required
            />
          </div>
          <div className="flex items-center justify-around my-5">
            <button
              onClick={handleEditToggle}
              className="bg-gray-800 text-white px-6 py-2 rounded-lg focus:outline-none hover:bg-green-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled
              className="bg-green-600 text-white px-6 py-2 rounded-lg focus:outline-none hover:bg-green-700 opacity-50"
            >
              Save Changes
            </button>

          </div>
        </form>
      ) : (
        <div className="mb-8">
          <h4 className='text-2xl text-center font-semibold my-5 underline'>Profile details</h4>
          <p className='my-3 text-lg'>Username: {user?.username || 'N/A'}</p>
          <p className='my-3 text-lg'>Email: {user?.email || 'N/A'}</p>
          <p className='my-3 text-lg'>Phone number: {user?.phone || 'N/A'}</p>
          <p className='my-3 text-lg'>Role: {user?.isAdmin ? 'Admin' : 'Customer' || 'N/A'}</p>
          <p className='my-3 text-lg'>Joined at: {new Date(user?.createdAt).toLocaleString()}</p>
          <button
            onClick={handleEditToggle}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg focus:outline-none hover:bg-blue-700 my-5"
          >
            Edit Profile
          </button>
        </div>
      )}

      {/* Order History */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-center underline">Order History</h2>
        <p className='my-7 text-lg'>check your orders <Link href="/users/orders" className='underline text-blue-500 '>Here</Link></p>

      </div>
    </div>
  )
}

export default ProfilePage
