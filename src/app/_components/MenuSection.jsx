"use client"
import React from 'react'
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { addToCart, removeFromCart, incrementQuantity, decrementQuantity } from '../../slices/cartSlice'
import io from 'socket.io-client'
import { PulseLoader } from 'react-spinners'
const MenuSection = () => {
    const dispatch = useDispatch()
    const cart = useSelector((state) => state.cart)
    const socket = io(`${process.env.NEXT_PUBLIC_SERVER_URL}`)
    const [isLoading, setIsLoading] = useState(true)
    const [foods, setFoods] = useState([])
    const [error, setError] = useState("")
    const [isHydrated, setIsHydrated] = useState(false)

    useEffect(() => {
        setIsHydrated(true)
        const fetchFoods = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/foods`);
                if (!res.ok) {
                    const { error } = await res.json();
                    setError(error);
                    return;
                }
                const data = await res.json();
                if (data.length === 0) {
                    console.log("no foods")
                }
                setFoods(data);
            } catch (err) {
                setError("Failed to fetch foods");
            } finally {
                setIsLoading(false)
            }
        };

        // Function to handle socket updates
        const handleFoodUpdate = (data) => {
            setFoods((prevFoods) => {
                if (data.action === "add") {
                    return [...prevFoods, data.food];
                }
                if (data.action === "edit") {
                    return prevFoods.map((food) =>
                        food._id === data.food._id ? data.food : food
                    );
                }
                if (data.action === "delete") {
                    return prevFoods.filter((food) => food._id !== data.foodId);
                }
                return prevFoods;
            });
        };

        // Subscribe to socket events
        socket.on("foodUpdated", handleFoodUpdate);

        fetchFoods();

        // Cleanup function to remove listener when component unmounts
        return () => {
            socket.off("foodUpdated", handleFoodUpdate);
        };
    }, []);
    const [imageIndexes, setImageIndexes] = useState({});

    useEffect(() => {
      const intervals = foods.map((food) => {
        if (food.images.length > 1 && food.isAvailable) {
          return setInterval(() => {
            setImageIndexes((prevIndexes) => ({
              ...prevIndexes,
              [food._id]: prevIndexes[food._id] === food.images.length - 1 ? 0 : (prevIndexes[food._id] || 0) + 1,
            }));
          }, 4000); 
        }
        return null;
      });
  
      return () => intervals.forEach((interval) => interval && clearInterval(interval)); // Cleanup intervals
    }, [foods])

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
    return (
        <div className='py-10 bg-gray-200 md:px-16'>
            <h1 className="md:text-4xl text-3xl font-bold text-center mb-8 text-gray-800">
                Our Special Menu Combinations
            </h1>
            <div className='my-10 bg-[whitesmoke] py-10 rounded-lg shadow-md shadow-black'>
                <h2 className='text-2xl text-center font-bold'>Breakfast special menu</h2>
                {
                    isLoading ? (
                        <div className="flex flex-col items-center justify-center min-h-[20vh] w-full">
                            <PulseLoader color="#36d7b7" size={20} margin={5} />
                            <p className="mt-4 text-xl font-bold text-black">Loading....</p>
                        </div>
                    ) : error ? (
                        <p className="text-center col-span-full text-red-500 text-2xl my-14 font-bold">
                            ⚠️ {error}
                        </p>
                    ) : foods.filter(food => food.category === "Breakfast" && food.isAvailable === true).length > 0 ? (
                        <div className='grid grid-cols-[repeat(auto-fit,minmax(300px,.5fr)) md:grid-cols-[repeat(auto-fit,minmax(300px,.5fr))] gap-6 md:px-20 py-6'>
                            {
                                foods.filter(food => food.category === "Breakfast" && food.isAvailable === true).slice(0, 3).map((food) => (
                                    <div
                                        key={food?._id}
                                        className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl"
                                    >
                                        {/* Image Section */}

                                        <div className="relative w-full h-52">
                                            <img
                                                src={food.images[imageIndexes[food._id] || 0]?.url}
                                                alt={food.name}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                                                Available
                                            </div>
                                        </div>

                                        {/* Details */}
                                        <div className="p-5">
                                            <h3 className="text-xl font-bold text-gray-900">{food.name}</h3>
                                            <p className="text-gray-500 text-sm mt-1">Delicious & fresh for your morning</p>
                                            <p className="text-green-600 font-semibold text-lg mt-2">Ksh {food.price}</p>

                                            {
                                                isHydrated && (
                                                    <div className='flex items-center py-3 justify-center mt-6'>
                                                        {cart?.cartItems.some(item => item.id === food._id) ? (
                                                            <div className='flex flex-col gap-3'>
                                                                <div className="flex items-center gap-2 ml-12">
                                                                    <button
                                                                        onClick={() => dispatch(decrementQuantity(food._id))}
                                                                        className="px-3 py-1 bg-gray-400 rounded hover:bg-gray-500 text-black text-md"
                                                                    >
                                                                        -
                                                                    </button>
                                                                    <span className="text-black text-md font-semibold">{cart?.cartItems.find(item => item.id === food._id).quantity}</span>
                                                                    <button
                                                                        onClick={() => dispatch(incrementQuantity(food._id))}
                                                                        className="px-3 py-1 bg-gray-400 rounded hover:bg-gray-500 text-black text-md"
                                                                    >
                                                                        +
                                                                    </button>
                                                                </div>
                                                                <div>
                                                                    <button
                                                                        onClick={() => dispatch(removeFromCart(food._id))}
                                                                        className="text-white w-full px-3 py-2 bg-red-600 rounded-lg text-lg mt-3"
                                                                    >
                                                                        Remove From Basket
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg shadow-md hover:bg-green-700 transition-all"
                                                                onClick={() => handleAddToBasket(food)}
                                                            >
                                                                Add To Basket
                                                            </button>
                                                        )}
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    ) : (
                        <p className="text-center col-span-full text-gray-500 text-xl my-10">There Are No Breakfast Foods Available Right Now.</p>
                    )
                }
            </div>
            <div className='my-10 bg-[whitesmoke] py-10 rounded-lg shadow-md shadow-black'>
                <h2 className='text-2xl text-center font-bold'>Lunch special menu</h2>
                {
                    isLoading ? (
                        <div className="flex flex-col items-center justify-center min-h-[20vh] w-full">
                            <PulseLoader color="#36d7b7" size={20} margin={5} />
                            <p className="mt-4 text-xl font-bold text-black">Loading....</p>
                        </div>
                    ) : error ? (
                        <p className="text-center col-span-full text-red-500 text-2xl my-14 font-bold">
                            ⚠️ {error}
                        </p>
                    ) : foods.filter(food => food.category === "Lunch" && food.isAvailable === true).length > 0 ? (
                        <div className='grid grid-cols-[repeat(auto-fit,minmax(300px,.5fr)) md:grid-cols-[repeat(auto-fit,minmax(300px,.5fr))] gap-6 md:px-20 py-6'>
                            {
                                foods.filter(food => food.category === "Lunch" && food.isAvailable === true ).slice(0, 3).map((food) => (
                                    <div
                                        key={food?._id}
                                        className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl"
                                    >
                                        {/* Image Section */}
                                        <div className="relative w-full h-52">
                                            <img
                                                src={food.images[imageIndexes[food._id] || 0]?.url}
                                                alt={food.name}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                                                Available
                                            </div>
                                        </div>

                                        {/* Details */}
                                        <div className="p-5">
                                            <h3 className="text-xl font-bold text-gray-900">{food.name}</h3>
                                            <p className="text-gray-500 text-sm mt-1">Delicious & fresh for your morning</p>
                                            <p className="text-green-600 font-semibold text-lg mt-2">Ksh {food.price}</p>

                                            {/* Button */}
                                            {
                                                isHydrated && (
                                                    <div className='flex items-center py-3 justify-center mt-6'>
                                                        {cart?.cartItems.some(item => item.id === food._id) ? (
                                                            <div className='flex flex-col gap-3'>
                                                                <div className="flex items-center gap-2 ml-12">
                                                                    <button
                                                                        onClick={() => dispatch(decrementQuantity(food._id))}
                                                                        className="px-3 py-1 bg-gray-400 rounded hover:bg-gray-500 text-black text-md"
                                                                    >
                                                                        -
                                                                    </button>
                                                                    <span className="text-black text-md font-semibold">{cart?.cartItems.find(item => item.id === food._id).quantity}</span>
                                                                    <button
                                                                        onClick={() => dispatch(incrementQuantity(food._id))}
                                                                        className="px-3 py-1 bg-gray-400 rounded hover:bg-gray-500 text-black text-md"
                                                                    >
                                                                        +
                                                                    </button>
                                                                </div>
                                                                <div>
                                                                    <button
                                                                        onClick={() => dispatch(removeFromCart(food._id))}
                                                                        className="text-white w-full px-3 py-2 bg-red-600 rounded-lg text-lg mt-3"
                                                                    >
                                                                        Remove From Basket
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg shadow-md hover:bg-green-700 transition-all"
                                                                onClick={() => handleAddToBasket(food)}
                                                            >
                                                                Add To Basket
                                                            </button>
                                                        )}
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    ) : (
                        <p className="text-center col-span-full text-gray-500 text-xl my-10">There Are No Lunch Foods Available Right Now.</p>
                    )
                }
            </div>
            <div className='my-10 bg-[whitesmoke] py-10 rounded-lg shadow-md shadow-black'>
                <h2 className='text-2xl text-center font-bold'>Dinner special menu</h2>
                {
                    isLoading ? (
                        <div className="flex flex-col items-center justify-center min-h-[20vh] w-full">
                            <PulseLoader color="#36d7b7" size={20} margin={5} />
                            <p className="mt-4 text-xl font-bold text-black">Loading....</p>
                        </div>
                    ) : error ? (
                        <p className="text-center col-span-full text-red-500 text-2xl my-14 font-bold">
                            ⚠️ {error}
                        </p>
                    ) : foods.filter(food => food.category === "Dinner" && food.isAvailable === true).length > 0 ? (
                        <div className='grid grid-cols-[repeat(auto-fit,minmax(300px,1fr)) md:grid-cols-[repeat(auto-fit,minmax(300px,.5fr))] gap-6 md:px-20 py-6 px-3'>
                            {
                                foods.filter(food => food.category === "Dinner" && food.isAvailable === true).slice(0, 3).map((food) => (
                                    <div
                                        key={food?._id}
                                        className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl"
                                    >
                                        {/* Image Section */}
                                        <div className="relative w-full h-52">
                                            <img
                                                src={food.images[imageIndexes[food._id] || 0]?.url}
                                                alt={food.name}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                                                Available
                                            </div>
                                        </div>

                                        {/* Details */}
                                        <div className="p-5">
                                            <h3 className="text-xl font-bold text-gray-900">{food.name}</h3>
                                            <p className="text-gray-500 text-sm mt-1">Delicious & fresh for your morning</p>
                                            <p className="text-green-600 font-semibold text-lg mt-2">Ksh {food.price}</p>

                                            {/* Button */}
                                            {
                                                isHydrated && (
                                                    <div className='flex items-center py-3 justify-center mt-6'>
                                                        {cart?.cartItems.some(item => item.id === food._id) ? (
                                                            <div className='flex flex-col gap-3'>
                                                                <div className="flex items-center gap-2 ml-12">
                                                                    <button
                                                                        onClick={() => dispatch(decrementQuantity(food._id))}
                                                                        className="px-3 py-1 bg-gray-400 rounded hover:bg-gray-500 text-black text-md"
                                                                    >
                                                                        -
                                                                    </button>
                                                                    <span className="text-black text-md font-semibold">{cart?.cartItems.find(item => item.id === food._id).quantity}</span>
                                                                    <button
                                                                        onClick={() => dispatch(incrementQuantity(food._id))}
                                                                        className="px-3 py-1 bg-gray-400 rounded hover:bg-gray-500 text-black text-md"
                                                                    >
                                                                        +
                                                                    </button>
                                                                </div>
                                                                <div>
                                                                    <button
                                                                        onClick={() => dispatch(removeFromCart(food._id))}
                                                                        className="text-white w-full px-3 py-2 bg-red-600 rounded-lg text-lg mt-3"
                                                                    >
                                                                        Remove From Basket
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg shadow-md hover:bg-green-700 transition-all"
                                                                onClick={() => handleAddToBasket(food)}
                                                            >
                                                                Add To Basket
                                                            </button>
                                                        )}
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    ) : (
                        <p className="text-center col-span-full text-gray-500 text-xl my-10">There Are No Dinner Foods Available Right Now.</p>
                    )
                }
            </div>
            <div className='my-10 bg-[whitesmoke] py-10 rounded-lg shadow-md shadow-black'>
                <h2 className='text-2xl text-center font-bold'>Drinks special menu</h2>
                {
                    isLoading ? (
                        <div className="flex flex-col items-center justify-center min-h-[20vh] w-full">
                            <PulseLoader color="#36d7b7" size={20} margin={5} />
                            <p className="mt-4 text-xl font-bold text-black">Loading....</p>
                        </div>
                    ) : error ? (
                        <p className="text-center col-span-full text-red-500 text-2xl my-14 font-bold">
                            ⚠️ {error}
                        </p>
                    ) : foods.filter(food => food.category === "Drinks" && food.isAvailable === true).length > 0 ? (
                        <div className='grid grid-cols-[repeat(auto-fit,minmax(300px,.5fr)) md:grid-cols-[repeat(auto-fit,minmax(300px,.5fr))] gap-6 md:px-20 py-6'>
                            {
                                foods.filter(food => food.category === "Drinks" && food.isAvailable === true).slice(0, 3).map((food) => (
                                    <div
                                        key={food?._id}
                                        className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl"
                                    >
                                        {/* Image Section */}
                                        <div className="relative w-full h-52">
                                            <img
                                                src={food.images[imageIndexes[food._id] || 0]?.url}
                                                alt={food.name}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                                                Available
                                            </div>
                                        </div>

                                        {/* Details */}
                                        <div className="p-5">
                                            <h3 className="text-xl font-bold text-gray-900">{food.name}</h3>
                                            <p className="text-gray-500 text-sm mt-1">Delicious & fresh for your morning</p>
                                            <p className="text-green-600 font-semibold text-lg mt-2">Ksh {food.price}</p>

                                            {/* Button */}
                                            {
                                                isHydrated && (
                                                    <div className='flex items-center py-3 justify-center mt-6'>
                                                        {cart?.cartItems.some(item => item.id === food._id) ? (
                                                            <div className='flex flex-col gap-3'>
                                                                <div className="flex items-center gap-2 ml-12">
                                                                    <button
                                                                        onClick={() => dispatch(decrementQuantity(food._id))}
                                                                        className="px-3 py-1 bg-gray-400 rounded hover:bg-gray-500 text-black text-md"
                                                                    >
                                                                        -
                                                                    </button>
                                                                    <span className="text-black text-md font-semibold">{cart?.cartItems.find(item => item.id === food._id).quantity}</span>
                                                                    <button
                                                                        onClick={() => dispatch(incrementQuantity(food._id))}
                                                                        className="px-3 py-1 bg-gray-400 rounded hover:bg-gray-500 text-black text-md"
                                                                    >
                                                                        +
                                                                    </button>
                                                                </div>
                                                                <div>
                                                                    <button
                                                                        onClick={() => dispatch(removeFromCart(food._id))}
                                                                        className="text-white w-full px-3 py-2 bg-red-600 rounded-lg text-lg mt-3"
                                                                    >
                                                                        Remove From Basket
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg shadow-md hover:bg-green-700 transition-all"
                                                                onClick={() => handleAddToBasket(food)}
                                                            >
                                                                Add To Basket
                                                            </button>
                                                        )}
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    ) : (
                        <p className="text-center col-span-full text-gray-500 text-xl my-10">There Are No Drinks Available Right Now.</p>
                    )
                }
            </div>
            <div className='my-10 bg-[whitesmoke] py-10 rounded-lg shadow-md shadow-black'>
                <h2 className='text-2xl text-center font-bold'>Snacks special menu</h2>
                {
                    isLoading ? (
                        <div className="flex flex-col items-center justify-center min-h-[20vh] w-full">
                            <PulseLoader color="#36d7b7" size={20} margin={5} />
                            <p className="mt-4 text-xl font-bold text-black">Loading....</p>
                        </div>
                    ) : error ? (
                        <p className="text-center col-span-full text-red-500 text-2xl my-14 font-bold">
                            ⚠️ {error}
                        </p>
                    ) : foods.filter(food => food.category === "Snacks" && food.isAvailable === true).length > 0 ? (
                        <div className='grid grid-cols-[repeat(auto-fit,minmax(300px,.5fr)) md:grid-cols-[repeat(auto-fit,minmax(300px,.5fr))] gap-6 md:px-20 py-6'>
                            {
                                foods.filter(food => food.category === "Snacks" && food.isAvailable === true).slice(0, 3).map((food) => (
                                    <div
                                        key={food?._id}
                                        className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl"
                                    >
                                        {/* Image Section */}
                                        <div className="relative w-full h-52">
                                            <img
                                                src={food.images[imageIndexes[food._id] || 0]?.url}
                                                alt={food.name}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                                                Available
                                            </div>
                                        </div>

                                        {/* Details */}
                                        <div className="p-5">
                                            <h3 className="text-xl font-bold text-gray-900">{food.name}</h3>
                                            <p className="text-gray-500 text-sm mt-1">Delicious & fresh for your morning</p>
                                            <p className="text-green-600 font-semibold text-lg mt-2">Ksh {food.price}</p>

                                            {/* Button */}
                                            {
                                                isHydrated && (
                                                    <div className='flex items-center py-3 justify-center mt-6'>
                                                        {cart?.cartItems.some(item => item.id === food._id) ? (
                                                            <div className='flex flex-col gap-3'>
                                                                <div className="flex items-center gap-2 ml-12">
                                                                    <button
                                                                        onClick={() => dispatch(decrementQuantity(food._id))}
                                                                        className="px-3 py-1 bg-gray-400 rounded hover:bg-gray-500 text-black text-md"
                                                                    >
                                                                        -
                                                                    </button>
                                                                    <span className="text-black text-md font-semibold">{cart?.cartItems.find(item => item.id === food._id).quantity}</span>
                                                                    <button
                                                                        onClick={() => dispatch(incrementQuantity(food._id))}
                                                                        className="px-3 py-1 bg-gray-400 rounded hover:bg-gray-500 text-black text-md"
                                                                    >
                                                                        +
                                                                    </button>
                                                                </div>
                                                                <div>
                                                                    <button
                                                                        onClick={() => dispatch(removeFromCart(food._id))}
                                                                        className="text-white w-full px-3 py-2 bg-red-600 rounded-lg text-lg mt-3"
                                                                    >
                                                                        Remove From Basket
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg shadow-md hover:bg-green-700 transition-all"
                                                                onClick={() => handleAddToBasket(food)}
                                                            >
                                                                Add To Basket
                                                            </button>
                                                        )}
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    ) : (
                        <p className="text-center col-span-full text-gray-500 text-xl my-10">There Are No snacks Available Right Now.</p>
                    )
                }
            </div>
        </div >
    )
}

export default MenuSection