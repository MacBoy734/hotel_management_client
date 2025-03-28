"use client"
import { useState } from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { FiMail } from 'react-icons/fi';
import Link from 'next/link';
import { toast } from 'react-toastify';

const Footer = () => {
  const[email, setEmail] = useState('')
  const [sending, setIsSending] = useState(false)
  const handleSubmit = async (e) => {
    e.preventDefault()
    if(!email)return
    try{
      setIsSending(true)
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/newsletter`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      })
      if(!res.ok){
        const {error} = await res.json()
        toast.error(error)
        return
      }else{
        toast.success('subscribed successfully')
        setEmail("")
      }
    }catch(error){
      toast.error(error.message)
    }finally{
      setIsSending(false)
    }
  }
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-6">
      <p className="text-sm text-yellow-400 mb-10 font-semibold text-center font-sniglet">
            Designed and Developed by <a href="https://macboy.netlify.app/" target='_blank' className='text-emerald-400 font-bold texl-md underline'>Mac Boy</a>✨.
      </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-12">
          <div>
            <h4 className="font-semibold text-lg mb-4">Company</h4>
            <ul>
              <li><Link href="/about" className="hover:text-blue-400">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-blue-400">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-blue-400">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-blue-400">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">Usefull Links</h4>
            <ul>
              <li><Link href="/auth/login" className="hover:text-blue-400">Login</Link></li>
              <li><Link href="/auth/register" className="hover:text-blue-400">Register</Link></li>
              <li><Link href="/basket" className="hover:text-blue-400">basket</Link></li>
              <li><Link href="/help" className="hover:text-blue-400">Help</Link></li>
              <li><Link href="/help/FAQS" className="hover:text-blue-400">FAQS</Link></li>
              <li><Link href="/help/contact-support" className="hover:text-blue-400">Contact support</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Social Media</h4>
            <ul className="flex space-x-4">
              <li><a href="#" className="text-gray-400 hover:text-blue-600"><FaFacebook size={20} /></a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-600"><FaTwitter size={20} /></a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-600"><FaInstagram size={20} /></a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-600"><FaLinkedin size={20} /></a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Newsletter</h4>
            <form className="flex flex-col sm:flex-row items-center" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="px-4 py-2 rounded-lg w-full sm:w-56 mb-4 sm:mb-0 border"
              />
              <button type="submit" className={`bg-blue-600 text-white px-6 py-2 rounded-lg sm:ml-4 hover:bg-blue-700 ${sending && 'opacity-50'}`} disabled={sending}>
                <FiMail size={20} />
              </button>
            </form>
          </div>
        </div>
        <div className="text-center mt-10">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Local Eatery. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
