"use client"
import { useState, useEffect } from "react";
import io from 'socket.io-client'
import { useDispatch, useSelector } from "react-redux";
import { addToCart, incrementQuantity, decrementQuantity, removeFromCart } from '../../slices/cartSlice';
import { PulseLoader } from 'react-spinners'
import Link from 'next/link'

const menuItems = [
  { id: 1, name: "Grilled Chicken", category: "Lunch", price: "$8", image: "/chicken.jpg" },
  { id: 2, name: "Pancakes", category: "Breakfast", price: "$5", image: "/pancakes.jpg" },
  { id: 3, name: "Fresh Juice", category: "Drinks", price: "$3", image: "/juice.jpg" },
  { id: 4, name: "Beef Burger", category: "Lunch", price: "$7", image: "/burger.jpg" },
  { id: 5, name: "Coffee", category: "Drinks", price: "$2", image: "/coffee.jpg" },
];

const categories = ["Breakfast", "Lunch", "Dinner", "Drinks", "Snacks"];

export default function MenuPage() {
  const dispatch = useDispatch()
  const cart = useSelector((state) => state.cart)
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [foods, setFoods] = useState([]);
  const [isHydrated, setIsHydrated] = useState(false)
  const [isLoading, setIsLoading] = useState(true);
  const socket = io(`${process.env.NEXT_PUBLIC_SERVER_URL}`)

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


  const filteredItems = foods.filter((item) =>
    (selectedCategory === "All" || item.category === selectedCategory) &&
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        Our Exquisite Menu
      </h1>

      <div className="flex flex-col md:flex-row md:justify-between items-center gap-4 mb-8">
        <div className="flex flex-wrap gap-4 md:justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-lg text-lg font-medium transition duration-300 ${selectedCategory === cat
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-200 hover:bg-gray-300"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search food..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:max-w-md px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
          <PulseLoader color="#36d7b7" size={20} margin={5} />
          <p className="mt-4 text-xl font-bold text-black">Loading Menu....</p>
        </div>
      ) : error ? (
        <p className="text-center col-span-full text-red-500 text-2xl mt-20 font-bold">
          ⚠️ {error}
        </p>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredItems.filter(item => item.isAvailable === true).map((item) => (
            <Link
              key={item._id}
              href={`/menu/${item._id}`}
              className="overflow-hidden rounded-lg shadow-lg bg-white transform transition duration-300 hover:scale-105"
            >
              <img src={item.images[0].url} alt={item.name} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-800">{item.name}</h2>
                <p className="text-gray-600 text-lg mt-1">Category: {item.category}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xl font-bold text-blue-600">${item.price}</span>
                </div>
                {
                  isHydrated && (
                    <div className='flex items-center py-1 justify-center mt-6'>
                      {cart?.cartItems.some(cartItem => cartItem.id === item._id) ? (
                        <div className='flex flex-col gap-3'>
                          <div className="flex items-center gap-2 ml-12">
                            <button
                              onClick={(e) => {e.preventDefault(); dispatch(decrementQuantity(item._id))}}
                              className="px-3 py-1 bg-gray-400 rounded hover:bg-gray-500 text-black text-md"
                            >
                              -
                            </button>
                            <span className="text-black text-md font-semibold">{cart?.cartItems.find(cartItem => cartItem.id === item._id).quantity}</span>
                            <button
                              onClick={(e) => {e.preventDefault(); dispatch(incrementQuantity(item._id))}}
                              className="px-3 py-1 bg-gray-400 rounded hover:bg-gray-500 text-black text-md"
                            >
                              +
                            </button>
                          </div>
                          <div>
                            <button
                              onClick={(e) => {e.preventDefault(); dispatch(removeFromCart(item._id))}}
                              className="text-white w-full px-3 py-2 bg-red-600 rounded-lg text-lg mt-3"
                            >
                              Remove From Basket
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg shadow-md hover:bg-green-700 transition-all"
                          onClick={(e) => {e.preventDefault(); handleAddToBasket(item)}}
                        >
                          Add To Basket
                        </button>
                      )}
                    </div>
                  )
                }
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center col-span-full text-gray-500 text-xl">No items found.</p>
      )}

    </div>
  );

}
