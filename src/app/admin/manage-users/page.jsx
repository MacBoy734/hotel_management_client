"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux"
import { logout } from "../../../slices/authSlice"
import { toast } from 'react-toastify';
import { PulseLoader } from 'react-spinners'

const ManageUsers = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentEditUser, setCurrentEditUser] = useState(null);

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/users`, { credentials: 'include' })
        if (!response.ok) {
          const { error } = await response.json()
          if (response.status === 403) {
            dispatch(logout())
            router.replace('/auth/login')
            toast.error(error)
            return
          }
          setError(error)
          return
        }
        const data = await response.json()
        setUsers(data)
      } catch (error) {
        toast.error(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])



  const handleEditUser = async (id) => {
    const user = users.find(user => user._id === id)
    if (user.isAdmin !== currentEditUser.isAdmin) {
      if (confirm('change this users role?')) {
        setIsProcessing(true)
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/${id}/edit`, { credentials: 'include' })
          if (!response.ok) {
            const { error } = await response.json()
            if (response.status === 403) {
              dispatch(logout())
              router.replace('/auth/login')
              toast.error(error)
              return
            }
            toast.error(error)
            return
          }
          const data = await response.json()
          setUsers(users.map((user) => (user._id === currentEditUser._id ? data : user)))
          toast.success('user role changed succesfully')
          setShowEditModal(false)
          setCurrentEditUser(null)
        } catch (error) {
          toast.error(error.message);
        } finally {
          setIsProcessing(false)
        }
      }
    }
    setShowEditModal(false);
  };
  if (isLoading) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-[60vh]`}>
        <PulseLoader color="#36d7b7" size={30} margin={5} />
        <p className="mt-4 text-lg font-medium text-white">Loading Users....</p>
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
    <div className="p-4 space-y-4 text-black">
      <h1 className="text-2xl font-bold">Manage Users</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search users by name or email..."
        className="w-full p-2 border rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* User Table */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6">
        {
          filteredUsers.length > 0 ? (
            <div>
              {filteredUsers.map((user) => (
                <div key={user._id} className="p-6 bg-white shadow-md rounded-xl border">
                  <p className="text-lg font-semibold">UserID: {user._id}</p>
                  <p className="text-md text-gray-600">Name: {user.username}</p>
                  <p className="text-md text-gray-600">Email: {user.email}</p>
                  <p className="text-md text-gray-600">Phone: {user.phone}</p>
                  <p className="text-md text-gray-600">Role: {user.isAdmin ? 'admin' : 'customer'}</p>
                  <p className="text-md text-gray-600">Created At: {new Date(user.createdAt).toLocaleString()}</p>

                  <div className="mt-4 flex space-x-2 justify-start">
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      onClick={() => {
                        setCurrentEditUser(user);
                        setShowEditModal(true);
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>

          ) : (
            <p className="text-center col-span-full text-gray-500 text-xl my-20">No Users found!.</p>
          )
        }
      </div>


      {/* Add User Button */}
      <button
        className="px-4 py-2 bg-green-500 text-white rounded"
        onClick={() => setShowAddModal(true)}
      >
        Add User
      </button>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-2">Add New User</h2>
            <input
              type="text"
              placeholder="Name"
              className="w-full p-2 border rounded mb-2"
              value={newUser.name}
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 border rounded mb-2"
              value={newUser.email}
            />
            <select
              className="w-full p-2 border rounded mb-2"
              value={newUser.role}
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded"
                onClick={handleAddUser}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && currentEditUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-2">Edit User</h2>
            <input
              type="text"
              placeholder="Name"
              className="w-full p-2 border rounded mb-2 opacity-50"
              value={currentEditUser.username}
              onChange={(e) =>
                setCurrentEditUser({ ...currentEditUser, name: e.target.value })
              }
              disabled
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 border rounded mb-2 opacity-50"
              value={currentEditUser.email}
              onChange={(e) =>
                setCurrentEditUser({ ...currentEditUser, email: e.target.value })
              }
              disabled
            />
            <select
              className="w-full p-2 border rounded mb-2"
              value={currentEditUser.isAdmin ? 'Admin' : 'Customer'}
              onChange={(e) => {
                setCurrentEditUser({ ...currentEditUser, isAdmin: e.target.value == "Customer" ? false : true })
              }
              }
            >
              <option value="Customer">Customer</option>
              <option value="Admin">Admin</option>
            </select>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 bg-blue-500 text-white rounded ${isProcessing && 'opacity-45'}`}
                disabled={isProcessing}
                onClick={() => handleEditUser(currentEditUser._id)}
              >
                {isProcessing ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
