"use client"
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../../../slices/authSlice'
import { toast } from 'react-toastify'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const Login = () => {
  const { user, isAuthenticated, status, error } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [sending, setIsSending] = useState(false)
  const [isClient, setIsClient] = useState(false)  

  const router = useRouter()

  // Set client flag after component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username || !password) return toast.error('Please enter all details!')
    setIsSending(true)
    const credentials = { username, password }
    try {
      await dispatch(login(credentials)).unwrap() 
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSending(false)
    }
  }

  
  useEffect(() => {
    if (isClient && status === 'succeeded' && isAuthenticated) {
      if (!user?.isAdmin) {
        router.push('/menu')
      }
      if (user?.isAdmin) router.push('/admin')
    }
  }, [status, isAuthenticated, user, router, isClient])

  // Render only after the component is mounted on the client
  if (!isClient) return null

  return (
    <div className="py-20 bg-[whitesmoke] px-3">
      <form
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md m-auto"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-bold mb-4 text-black font-lato">Login to your account</h2>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="username">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            className="w-full p-2 rounded bg-[rgba(3,160,181,0.41)] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
            name="username"
            maxLength={10}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            className="w-full p-2 rounded bg-[rgba(3,160,181,0.41)] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
            name="password"
            maxLength={20}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          disabled={sending}
          type="submit"
          className={`w-full bg-teal-500 text-white p-2 mt-3 rounded hover:bg-teal-600 transition ${sending && 'opacity-50'}`}
        >
          {sending ? 'Logging in...' : 'Login'}
        </button>

        <p className="mt-5 font-roboto text-black">
          Don't have an account? <Link href="/auth/register" className="text-blue-800">Register</Link>
        </p>
        {error === 'incorrect password!' && (
          <h2 className="text-red-800 mb-3">
            Forgot password?{' '}
            <Link href="/auth/forgotpassword" className="text-blue-800 underline font-bold">
              Reset
            </Link>
          </h2>
        )}
      </form>
    </div>
  )
}

export default Login
