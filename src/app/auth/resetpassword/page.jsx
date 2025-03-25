"use client"
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'react-toastify'

const ResetPasswordContent = () => {
    const router = useRouter()
    const searchParams = useSearchParams();
    const [sending, setSending] = useState(false)
    const [password, setPassword] = useState('')
    const [password1, setPassword1] = useState('')
    const [token, setToken] = useState(null)

    // Get token from query parameters
    useEffect(() => {
        const query = searchParams.get("token") || ""
        setToken(query)
    }, [router.query])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (password !== password1) {
            return toast.error('The passwords do not match!')
        }

        if (!token) {
            return toast.error('Invalid or missing token.')
        }

        try {
            setSending(true)
            const body = { password, token }

            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/resetpassword`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            })

            if (!response.ok) {
                const {error} = await response.json()
                toast.error(error)
                return
            }

            toast.success("password changed succesfully")
            router.push('/auth/login')
        } catch (error) {
            toast.error(error.message)
        } finally {
            setSending(false)
        }
    }

    return (
        <div className='min-h-[60vh] mt-24 px-3 bg-[whitesmoke]'>
            <form
                className="bg-white p-6 rounded-lg shadow-md w-full max-w-md m-auto"
                onSubmit={handleSubmit}
            >
                <h2 className='font-monserrat text-lg mb-5'>Change your password</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="password">
                        New Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        placeholder='New password'
                        className="w-full p-2 rounded bg-[rgba(3,160,181,0.41)] my-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                        maxLength={20}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="password1">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        id="password1"
                        value={password1}
                        placeholder='Confirm Password'
                        className="w-full p-2 rounded bg-[rgba(3,160,181,0.41)] my-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                        maxLength={20}
                        onChange={(e) => setPassword1(e.target.value)}
                    />
                </div>

                <button
                    disabled={sending}
                    type="submit"
                    className={`w-full bg-teal-500 text-white p-2 mt-3 rounded hover:bg-teal-600 transition ${sending ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {sending ? 'Sending...' : 'Reset'}
                </button>
            </form>
        </div>
    )
}

export default function ResetPassword() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading..</div>}>
            <ResetPasswordContent />
        </Suspense>
    );
}
