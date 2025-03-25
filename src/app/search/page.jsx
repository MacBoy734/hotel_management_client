"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { toast } from "react-toastify";
import { addToCart } from "../../slices/cartSlice"
import Link from "next/link";
import { useDispatch } from "react-redux";
import { PulseLoader } from 'react-spinners'

function SearchPageContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("")
    const dispatch = useDispatch()

    useEffect(() => {
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
    const handleAddToCart = (id, name, price, totalQuantity, images) => {
        const item = {
            id,
            name,
            price,
            totalQuantity,
            quantity: 1,
            images
        }
        return dispatch(addToCart(item))
    }

    if (loading) {
        return (
            <div className={`flex flex-col items-center justify-center min-h-[60vh] bg-black`}>
                <PulseLoader color="#36d7b7" size={30} margin={5} />
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
        <div className="p-6 bg-black text-white">
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
                                {product.images && product.images[0] && product.images[0].url ? (
                                    <img
                                        src={product.images[0].url}
                                        alt={product.name}
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                                        No Image Available
                                    </div>
                                )}
                            </div>
                            <h3 className="text-xl font-semibold mt-4">{product.name}</h3>
                            <p className="text-gray-300">${product.price}</p>
                            <small className="text-red-400 block mt-3">
                                only {product.quantity} remaining!
                            </small>
                            <button
                                className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleAddToCart(
                                        product._id,
                                        product.name,
                                        product.price,
                                        product.quantity,
                                        product.images
                                    );
                                }}
                            >
                                Add to Basket
                            </button>
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