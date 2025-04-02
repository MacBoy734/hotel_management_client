"use client"
import Link from "next/link";
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../slices/authSlice'
import { useRouter } from 'next/navigation'
import { CiUser } from "react-icons/ci";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { IoIosHelpCircleOutline, IoIosMenu, IoMdClose } from "react-icons/io";
import { GiShoppingCart } from "react-icons/gi";
import { useState, useEffect, useRef } from "react";
import { BiSearch } from "react-icons/bi";


export default function Navbar() {
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const { cartItems } = useSelector((state) => state.cart)
  const dispatch = useDispatch()
  const [accountDropdown, setAccountDropdown] = useState(false);
  const [helpDropdown, setHelpDropdown] = useState(false);
  const [query, setQuery] = useState("");
  const [isHydrated, setIsHydrated] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const router = useRouter()


  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  // Refs to track the dropdowns
  const accountRef = useRef(null);
  const helpRef = useRef(null);

  // Function to close dropdowns when clicking outside
  const handleClickOutside = (e) => {
    if (accountRef.current && !accountRef.current.contains(e.target)) {
      setAccountDropdown(false);
    }
    if (helpRef.current && !helpRef.current.contains(e.target)) {
      setHelpDropdown(false);
    }
  };

  useEffect(() => {
    setIsHydrated(true)
    // Add event listener for clicks outside
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener when component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // LOG OUT FUNCTION
  const handleLogOut = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/logout`, { credentials: 'include' })
    dispatch(logout())
    return router.replace('/auth/login')
  }

  return (
    <nav className="bg-gray-800 text-white p-4 fixed w-full left-0 top-0 z-40"> 
      <section>
        <div className="md:flex hidden items-center justify-around gap-3">
          <Link href="/" className="text-white text-2xl hover:text-sky-500">Eatery</Link>
          <form className="flex space-x-1 w-[50%]" onSubmit={handleSearch}>
            <input
              type="text"
              className="p-2 text-lg rounded-md w-[90%] pr-3 border"
              placeholder="I Want To Eat..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="p-2 text-lg text-white bg-black rounded-md hover:bg-white hover:text-black transition-all duration-100 ease-in" type="submit">
              Search
            </button>
          </form>
          {/* Account Dropdown */}
          <div className="relative cursor-pointer" ref={accountRef}>
            <div className="flex items-center space-x-1" onClick={() => setAccountDropdown(!accountDropdown)}>
              <CiUser className="size-6" />
              <h4 className="text-md">Account</h4>
              {accountDropdown ? <RiArrowDropUpLine className="size-6" /> : <RiArrowDropDownLine className="size-6" />}
              
            </div>
            {accountDropdown && (
              <div className="absolute left-0 mt-2 bg-white text-black shadow-md rounded-md w-40 cursor-pointer z-20">
                {isAuthenticated ? (
                  <ul className="py-2">
                    <li className="px-4 py-2 hover:bg-gray-200"><Link href="/users/profile">Profile</Link></li>
                    <li className="px-4 py-2 hover:bg-gray-200"><Link href="/users/orders">Orders</Link></li>
                    {
                      user.isAdmin && (
                        <li className="px-4 py-2 hover:bg-gray-200"><Link href="/admin">dashboard</Link></li>
                      )
                    }
                    <li className="px-4 py-2 hover:bg-gray-200"><button onClick={handleLogOut}>Logout</button></li>
                  </ul>
                ) : (
                  <ul className="py-2">
                    <li className="px-4 py-2 hover:bg-gray-200"><Link href="/auth/login">Login</Link></li>
                    <li className="px-4 py-2 hover:bg-gray-200"><Link href="/auth/register">Register</Link></li>
                  </ul>
                )}

              </div>
            )}
          </div>
          {/* Help Dropdown */}
          <div className="relative" ref={helpRef}>
            <div className="flex items-center space-x-1 cursor-pointer" onClick={() => setHelpDropdown(!helpDropdown)}>
              <IoIosHelpCircleOutline className="size-6" />
              <h4 className="text-md">Help</h4>
              {helpDropdown ? <RiArrowDropUpLine className="size-6" /> : <RiArrowDropDownLine className="size-6" />}
              
            </div>
            {helpDropdown && (
              <div className="absolute left-0 mt-2 bg-white text-black shadow-md rounded-md w-40 cursor-pointer z-20">
                <ul className="py-2">
                  <li className="px-4 py-2 hover:bg-gray-200"><Link href="/help">Help</Link></li>
                  <li className="px-4 py-2 hover:bg-gray-200"><Link href="/help/FAQS">FAQS</Link></li>
                  <li className="px-4 py-2 hover:bg-gray-200"><Link href="/help/contact-support">Contact Support</Link></li>
                </ul>
              </div>
            )}
          </div>
          {/* Cart Icon */}
          <div>
            <Link href="/basket" className="flex items-center space-x-1">
              <GiShoppingCart className="size-6" />
              <h4 className="text-md">Basket {isHydrated && <sup className={` text-lg font-normal ${cartItems?.length <= 0 ? 'text-red-600' : 'text-green-500'}`}>{cartItems?.length || 0}</sup>}</h4>
            </Link>
          </div>
        </div>
        {/* Mobile Search Icon */}
        <div className="md:hidden flex items-center justify-between space-x-3 px-3">
          <Link href="/" className="text-white text-2xl">Eatery</Link>
          <div className="flex gap-5 items-center">
            <button onClick={() => setSearchOpen(!searchOpen)}>
              <BiSearch className="text-2xl" />
            </button>

            <button onClick={() => setMenuOpen(true)}>
              <IoIosMenu className="text-2xl font-bold size-6 text-white" />
            </button>
          </div>
        </div>
      </section>
      {/* Mobile Search Bar */}
      {searchOpen && (
        <div className="md:hidden flex flex-col items-center space-y-2 mt-3 p-3 rounded-md shadow-lg">
          <form className="flex space-x-1 w-full" onSubmit={handleSearch}>
            <input
              type="text"
              className="p-2 text-lg rounded-md w-full border"
              placeholder="I Want To Eat..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              className="p-2 text-lg text-white bg-black rounded-md"
              type="submit"
            >
              Search
            </button>
          </form>
        </div>
      )}

      {/* Mobile Menu (Only visible when menuOpen is true) */}
      {menuOpen && (
        <div className={`md:hidden flex flex-col gap-11 bg-gray-800 p-4 rounded-md shadow-lg h-screen fixed left-0 top-0 w-3/4 z-50`}>
          <div className="absolute right-6 font-bold">
            <IoMdClose className="text-4xl font-bold size-6 text-white" onClick={() => setMenuOpen(false)} />
          </div>

          <div className="pt-10 text-lg font-semibold">
            {isAuthenticated ? (
              <ul className="py-2">
                <li className="px-4 py-2"> <Link href="/users/profile" onClick={() => setMenuOpen(false)}>Profile</Link></li>
                <li className="px-4 py-2"><Link href="/users/orders" onClick={() => setMenuOpen(false)} >Orders</Link></li>
                {
                  user.isAdmin && (
                    <li className="px-4 py-2"><Link href="/admin" onClick={() => setMenuOpen(false)}>dashboard</Link></li>
                  )
                }
                <li className="px-4 py-2"><Link href="/basket" onClick={() => setMenuOpen(false)}>Basket {isHydrated && <span className={` ml-3 text-lg font-normal ${cartItems?.length <= 0 ? 'text-red-600' : 'text-green-500'}`}>({cartItems?.length || 0})</span>}</Link></li>
                <li className="px-4 py-2"><Link href="/help" onClick={() => setMenuOpen(false)}>Help</Link></li>
                <li className="px-4 py-2"><Link href="/help/FAQS" onClick={() => setMenuOpen(false)}>FAQS</Link></li>
                <li className="px-4 py-2"><Link href="/help/contact-support" onClick={() => setMenuOpen(false)}>Contact Support</Link></li>
                <li className="px-4 py-2 text-red-500"><button onClick={() => {handleLogOut(); setMenuOpen(false);}}>Logout</button></li>
              </ul>
            ) : (
              <ul className="py-2">
                <li className="px-4 py-2"><Link href="/auth/login" onClick={() => setMenuOpen(false)}>Login</Link></li>
                <li className="px-4 py-2"><Link href="/auth/register" onClick={() => setMenuOpen(false)}>Register</Link></li>
                <li className="px-4 py-2"><Link href="/basket" onClick={() => setMenuOpen(false)}>Basket {isHydrated && <span className={` ml-3 text-lg font-normal ${cartItems?.length <= 0 ? 'text-red-600' : 'text-green-500'}`}>({cartItems?.length || 0})</span>}</Link></li>
                <li className="px-4 py-2"><Link href="/help" onClick={() => setMenuOpen(false)}>Help</Link></li>
                <li className="px-4 py-2"><Link href="/help/FAQS" onClick={() => setMenuOpen(false)}>FAQS</Link></li>
                <li className="px-4 py-2"><Link href="/help/contact-support" onClick={() => setMenuOpen(false)}>Contact Support</Link></li>
              </ul>
            )}

          </div>
        </div>
      )}
    </nav>
  );
}
