"use client"
import { useState } from 'react'
import { toast } from 'react-toastify'
import Link from "next/link";

const ForgotPassword = () => {
    const [sending, setSending] = useState(false)
    const [email, setEmail] = useState('')
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        const body = {
            email
        }
        try {
            setSending(true)
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/forgotpassword`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            })
            if (!response.ok) {
                const { error } = await response.json()
                return toast.error(error)
            }
            const { message } = await response.json()
            setSuccess(true)
            return toast.success(message)
        } catch (error) {
            toast.error(error.message)
        } finally {
            setSending(false)
        }
    }

    return (
        <div className='mt-16 min-h-[60vh] flex items-center justify-center bg-[whitesmoke] px-3'>
            {
                success ? (
                    <div class="bg-green-100 text-green-800 p-6 rounded-lg shadow-lg max-w-lg mx-auto my-8">
                        <div class="flex items-center space-x-3">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <h3 class="text-xl font-semibold">Password Reset Email Sent!</h3>
                        </div>
                        <p class="mt-4 text-lg">We’ve sent a password reset link to your email address. Please check your inbox to reset your password.</p>
                        <p class="mt-2 text-sm text-gray-700">If you don’t see the email in your inbox, please check your spam folder or try again later. The reset link will expire in 10 minutes.</p>
                        <div class="mt-6 text-center">
                            <Link href="/auth/login" class="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                                Go to Login
                            </Link>
                        </div>
                    </div>

                ) : (
                    <form
                        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md m-auto"
                        onSubmit={handleSubmit}
                    >
                        <h2 className='font-monserrat text-lg mb-5'>Enter your email to reset your password</h2>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="email">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                placeholder='Email'
                                className="w-full p-2 rounded bg-[rgba(3,160,181,0.41)] my-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                required
                                name="email"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <button
                            disabled={sending}
                            type="submit"
                            className={`w-full bg-teal-500 text-white p-2 mt-3 rounded hover:bg-teal-600 transition ${sending ? 'opacity-50' : ''}`}
                        >
                            {sending ? 'Sending...' : 'Reset'}
                        </button>
                    </form>
                )
            }
        </div>
    )
}

export default ForgotPassword
