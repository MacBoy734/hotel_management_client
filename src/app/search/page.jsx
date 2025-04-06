"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addToCart, removeFromCart, editCartItems, incrementQuantity, decrementQuantity } from "../../slices/cartSlice"
import Link from "next/link";
import { useDispatch } from "react-redux";
import { PulseLoader } from 'react-spinners'

function SearchPageContent() {
    const searchParams = useSearchParams();
    const cart = useSelector((state) => state.cart)
    const query = searchParams.get("q") || "";
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isHydrated, setIsHydrated] = useState(false)
    const [error, setError] = useState("")
    const dispatch = useDispatch()

    useEffect(() => {
        setIsHydrated(true)
        if (!query) return;
        fetchResults();
    }, [query]);

    const fetchResults = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/foods/search?q=${query}`);
            if (!res.ok) {
                const { error } = await res.json()
                setError(error)
                return
            }
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false);
        }
    };
    const [imageIndexes, setImageIndexes] = useState({});

    useEffect(() => {
        const intervals = products.map((product) => {
            if (product.images.length > 1 && product.isAvailable) {
                return setInterval(() => {
                    setImageIndexes((prevIndexes) => ({
                        ...prevIndexes,
                        [product._id]: prevIndexes[product._id] === product.images.length - 1 ? 0 : (prevIndexes[product._id] || 0) + 1,
                    }));
                }, 4000);
            }
            return null;
        });

        return () => intervals.forEach((interval) => interval && clearInterval(interval)); // Cleanup intervals
    }, [products])

    const handleAddToBasket = (item) => {
        const food = {
            id: item._id,
            name: item.name,
            price: item.price,
            totalQuantity: item.quantity,
            quantity: 1,
            images: item.images
        }
        return dispatch(addToCart(food))
    }

    if (loading) {
        return (
            <div className={`flex flex-col items-center justify-center min-h-[60vh] bg-black`}>
                <PulseLoader color="#36d7b7" size={20} margin={5} />
                <p className="mt-4 text-lg font-medium text-white">Searching Products....</p>
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
        <div className="px-6 py-20 bg-black text-white">
            <h1 className="text-2xl font-bold text-center">Search Results for "{query}"</h1>
            {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {products.map((product) => (
                        <Link
                            href={`/menu/${product._id}`}
                            key={product._id}
                            className="border p-4 rounded-lg shadow-lg block"
                        >
                            <div className="w-full h-48 bg-gray-300 bg-cover bg-center">
                                <img
                                    src={product.images[imageIndexes[product._id] || 0]?.url}
                                    alt={product.name}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            </div>
                            <div className="my-4">
                                {
                                    <p className={`${product.isAvailable ? 'text-green-500' : 'text-red-500'} font-semibold`}>{product.isAvailable ? 'Available' : 'This Food is not available at the moment!'}</p>
                                }
                            </div>
                            <h3 className="text-xl font-semibold mt-4">{product.name}</h3>
                            <p className="text-gray-300">${product.price}</p>
                            <small className="text-red-400 block mt-3">
                                only {product.quantity} remaining!
                            </small>
                            {
                                isHydrated && (
                                    <div className='flex items-center py-1 justify-center mt-6'>
                                        {cart?.cartItems.some(cartItem => cartItem.id === product._id) ? (
                                            <div className='flex flex-col gap-3'>
                                                <div className="flex items-center gap-2 ml-12">
                                                    <button
                                                        disabled={!product.isAvailable}
                                                        onClick={(e) => { e.preventDefault(); dispatch(decrementQuantity(product._id)) }}
                                                        className="px-3 py-1 bg-gray-400 rounded hover:bg-gray-500 text-black text-md"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="text-md font-semibold">{cart?.cartItems.find(cartItem => cartItem.id === product._id).quantity}</span>
                                                    <button
                                                        disabled={!product.isAvailable}
                                                        onClick={(e) => { e.preventDefault(); dispatch(incrementQuantity(product._id)) }}
                                                        className="px-3 py-1 bg-gray-400 rounded hover:bg-gray-500 text-black text-md"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <div>
                                                    <button
                                                        onClick={(e) => { e.preventDefault(); dispatch(removeFromCart(product._id)) }}
                                                        className="text-white w-full px-3 py-2 bg-red-600 rounded-lg text-lg mt-3"
                                                    >
                                                        Remove From Basket
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                disabled={!product.isAvailable}
                                                className={`w-full mt-4 bg-green-600 text-white py-2 rounded-lg shadow-md hover:bg-green-700 transition-all ${!product.isAvailable && 'opacity-35 cursor-not-allowed'}`}
                                                onClick={(e) => { e.preventDefault(); handleAddToBasket(product) }}
                                            >
                                                Add To Basket
                                            </button>
                                        )}
                                    </div>
                                )
                            }
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="flex items-center justify-center min-h-[60vh]">
                    <p className="text-lg text-white text-center">{query} was not found! Please try searching something else.</p>
                </div>
            )}
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading search results...</div>}>
            <SearchPageContent />
        </Suspense>
    );
}