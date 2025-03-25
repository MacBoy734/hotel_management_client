"use client"
import React from 'react'
import { useState, useEffect } from "react"
import io from 'socket.io-client'
import { PulseLoader } from 'react-spinners'
const MenuSection = () => {
    const socket = io(`${process.env.NEXT_PUBLIC_SERVER_URL}`)
    const [isLoading, setIsLoading] = useState(true)
    const [foods, setFoods] = useState([])
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchFoods = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/foods`);
                if (!res.ok) {
                    const { error } = await res.json();
                    setError(error);
                    return;
                }
                const data = await res.json();
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
    return (
        <div className='py-10 bg-gray-200 md:px-16'>
            <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
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
                    ) : foods.length > 0 ? (
                        <div className='grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 md:px-20 py-6'>
                            {
                                foods.map((food) => (
                                    <div className='flex items-center justify-between px-5' key={food?._id}>
                                        <div className='flex gap-3 items-center'>
                                            <img src={food.images[0].url} alt={food.name} className='size-32' />
                                            <p>{food.name}</p>
                                        </div>
                                        <small>{food.price}</small>
                                    </div>
                                ))
                            }
                        </div>
                    ) : (
                        <p className="text-center col-span-full text-gray-500 text-xl my-10">No items found.</p>
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
                    ) : foods.length > 0 ? (
                        <div className='grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 md:px-20 py-6'>
                            {
                                foods.map((food) => (
                                    <div className='flex items-center justify-between px-5 bg-white' key={food?._id}>
                                        <div className='flex gap-3 items-center'>
                                            <img src={food.images[0].url} alt={food.name} className='size-32' />
                                            <p>{food.name}</p>
                                        </div>
                                        <small>{food.price}</small>
                                    </div>
                                ))
                            }
                        </div>
                    ) : (
                        <p className="text-center col-span-full text-gray-500 text-xl my-10">No items found.</p>
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
                    ) : foods.length > 0 ? (
                        <div className='grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 md:px-20 py-6'>
                            {
                                foods.map((food) => (
                                    <div className='flex items-center justify-between px-5' key={food?._id}>
                                        <div className='flex gap-3 items-center'>
                                            <img src={food.images[0].url} alt={food.name} className='size-32' />
                                            <p>{food.name}</p>
                                        </div>
                                        <small>{food.price}</small>
                                    </div>
                                ))
                            }
                        </div>
                    ) : (
                        <p className="text-center col-span-full text-gray-500 text-xl my-10">No items found.</p>
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
                    ) : foods.length > 0 ? (
                        <div className='grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 md:px-20 py-6'>
                            {
                                foods.map((food) => (
                                    <div className='flex items-center justify-between px-5' key={food?._id}>
                                        <div className='flex gap-3 items-center'>
                                            <img src={food.images[0].url} alt={food.name} className='size-32' />
                                            <p>{food.name}</p>
                                        </div>
                                        <small>{food.price}</small>
                                    </div>
                                ))
                            }
                        </div>
                    ) : (
                        <p className="text-center col-span-full text-gray-500 text-xl my-10">No items found.</p>
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
                    ) : foods.length > 0 ? (
                        <div className='grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 md:px-20 py-6'>
                            {
                                foods.map((food) => (
                                    <div className='flex items-center justify-between px-5' key={food?._id}>
                                        <div className='flex gap-3 items-center'>
                                            <img src={food.images[0].url} alt={food.name} className='size-32' />
                                            <p>{food.name}</p>
                                        </div>
                                        <small>{food.price}</small>
                                    </div>
                                ))
                            }
                        </div>
                    ) : (
                        <p className="text-center col-span-full text-gray-500 text-xl my-10">No items found.</p>
                    )
                }
            </div>
        </div>
    )
}

export default MenuSection