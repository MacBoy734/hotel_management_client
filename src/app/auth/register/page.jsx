"use client"
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { register } from '../../../slices/authSlice'
import Link from 'next/link'
import {toast} from 'react-toastify'
import { useRouter } from 'next/navigation'
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';


const Register = () => {
  const { isAuthenticated, status } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [sending, setIsSending] = useState(false)
  const [isClient, setIsClient] = useState(false)  // For client-side check

  const router = useRouter()

  // Set client flag after component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    function isValidEmail(email) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    }
    function isValidPhone(phone) {
      const regex = /^(?:\+254|254|0)?7\d{8}$/;
      return regex.test(phone);
    }
    
    if (!username || !password || !email || !phone) return toast.error('Please enter all details!')
    if(!isValidEmail(email) || !isValidPhone(phone)){
      toast.error("in valid Email or phone number!")
      return
    }
    setIsSending(true)
    const credentials = { username, password, email, phone }
    try {
      await dispatch(register(credentials)).unwrap() 
    } catch (error) {
      toast.error(error.message)  
    } finally {
      setIsSending(false)
    }
  }


  useEffect(() => {
    if (status === 'succeeded' && isAuthenticated) {
      router.push('/menu')
    }
  }, [status, isAuthenticated])



  if (!isClient) return null

  return (
    <div className='py-16 bg-[whitesmoke] px-3'>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md m-auto">
        <h2 className="text-xl font-bold mb-4 text-black font-lato">Register for an account.</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder='Enter your email'
            value={email}
            maxLength={40}
            className="w-full p-2 rounded bg-[rgba(3,160,181,0.41)] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
            name='email'
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            placeholder='Username'
            value={username}
            className="w-full p-2 rounded bg-[rgba(3,160,181,0.41)] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
            name='username'
            onChange={e => setUsername(e.target.value)}
            minLength={3}
            maxLength={10}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="phone">Phone number</label>
          <PhoneInput
            country={'ke'}
            value={phone}
            onlyCountries={['ke']}
            id="phone"
            required
            isValid={(value, country) => value.startsWith(country.dialCode)}
            onChange={(value) => setPhone(value)} 
            inputStyle={{
              width: '100%',
              padding: '20px 10px 20px 50px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              color: 'black'
            }}
          />
        </div>


        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            className="w-full p-2 rounded bg-[rgba(3,160,181,0.41)] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder='Password'
            minLength={1}
            maxLength={20}
            name='password'
            onChange={e => setPassword(e.target.value)}
          />
        </div>


        <button
          type="submit"
          disabled={sending}
          className={`w-full bg-teal-500 text-white p-2 rounded hover:bg-teal-600 transition ${sending ? 'opacity-50' : ''}`}
        >
          {sending ? 'Processing...' : 'Register'}
        </button>
        <p className='mt-5 text-black'>
          Already have an account? <Link href='/auth/login' className='text-blue-700'>Login</Link>
        </p>
      </form>
    </div>
  )
}

export default Register
