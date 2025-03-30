"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux"
import { logout } from "../../../slices/authSlice"
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { PulseLoader } from 'react-spinners'
import io from 'socket.io-client'
const ManageFoods = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const socket = io(`${process.env.NEXT_PUBLIC_SERVER_URL}`)
  const [foods, setFoods] = useState([]);
  const [newFood, setNewFood] = useState();
  const [editFood, setEditFood] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]); // Store selected files
  const [showAddFood, setShowAddfood] = useState(false);
  const [isAddingFood, setIsAddingFood] = useState(false)
  const [error, setError] = useState("")
  const [isFoodsLoading, setIsFoodsLoading] = useState(true)

  const [foodName, setFoodName] = useState("");
  const [foodDescription, setFoodDescription] = useState("");
  const [foodCategory, setFoodCategory] = useState("electronics");
  const [foodPrice, setFoodPrice] = useState(0);
  const [foodQuantity, setFoodQuantity] = useState(0);

  const categories = ["Breakfast", "Lunch", "Dinner", "Drinks", "Snacks"];


  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files) {
      setSelectedFiles((prevFiles) => [...prevFiles, ...Array.from(files)]);
    }
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!foodName.trim()) {
      toast.error("food name is required.");
      return;
    }
    if (!foodCategory.trim()) {
      toast.error("Food category is required.");
      return;
    }
    if (foodPrice <= 0) {
      toast.error("food price must be greater than zero.");
      return;
    }
    if (foodQuantity < 0) {
      toast.error("food quantity cannot be negative.");
      return;
    }
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one image.");
      return;
    }

    const formData = new FormData();
    formData.append("name", foodName.trim());
    formData.append("description", foodDescription.trim());
    formData.append("price", foodPrice.toString());
    formData.append("quantity", foodQuantity.toString());
    formData.append("category", foodCategory.trim());
    selectedFiles.forEach((file) => {
      formData.append("images", file);
    });

    try {
      setIsAddingFood(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/foods/addfood`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!response.ok) {
        const { error } = await response.json()
        if (response.status === 403) {
          dispatch(logout())
          router.replace('/unauthorized')
          toast.error(error)
          return
        }
        toast.error(error)
        return
      }
      const data = await response.json();
      toast.success("Food added successfully!");
      setSelectedFiles([]);
      setFoodName("");
      setFoodDescription("");
      setFoodPrice(0);
      setFoodQuantity(0);
      setFoodCategory("Breakfast");
      router.push('/admin/manage-foods')
    } catch (error) {
      toast.error("An error occurred while uploading Food details.");
    } finally {
      setIsAddingFood(false)
    }
  };

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
        setIsFoodsLoading(false)
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

  // Handle edit food
  const handleEditFood = async () => {
    try {
      const response = await fetch(`http://localhost:5000/foods/${editFood.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFood),
      });
      if (!response.ok) {
        const { error } = await response.json()
        if (response.status === 403) {
          dispatch(logout())
          router.replace('/unauthorized')
          toast.error(error)
          return
        }
        toast.error(error)
        return
      }
      const data = await response.json();
      setFoods(foods.map((p) => (p.id === editFood.id ? data : p)));
      setEditFood(null);
    } catch (error) {
      console.error("Error editing food:", error);
    }
  };


  const handleEdit = (id) => {
    router.push(`/menu/edit/${id}`)
  }

  // Handle delete food
  const handleDeleteFood = async (id) => {
    if (confirm("delete this food? it will be deleted permanently and this cant be undone!")) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/foods/deletefood/${id}`, { method: "DELETE", credentials: 'include' });
        if (!response.ok) {
          const { error } = await response.json()
          if (response.status === 403) {
            dispatch(logout())
            router.replace('/auth/login')
            toast.error(error)
            return
          }
          toast.error(error)
          return
        }
        toast.success('food deleted')
        setFoods(foods.filter((p) => p._id !== id));
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="text-black p-6">
      <h2 className="text-xl font-bold mb-4">Manage Foods</h2>

      {/* Add Food Form */}
      <form className="space-y-4 bg-white p-6 shadow rounded-lg" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium">Food Name</label>
          <input
            type="text"
            className="w-full mt-1 p-2 border rounded"
            placeholder="Enter food name"
            value={foodName}
            required
            onChange={(e) => setFoodName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Category</label>
          <select
            className="w-full mt-1 p-2 border rounded"
            value={foodCategory}
            onChange={(e) => setFoodCategory(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            className="w-full mt-1 p-2 border rounded"
            rows={4}
            placeholder="Enter description"
            required
            minLength={20}
            value={foodDescription}
            onChange={(e) => setFoodDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Price (USD)</label>
            <input
              type="number"
              className="w-full mt-1 p-2 border rounded"
              placeholder="Enter price"
              value={foodPrice}
              onChange={(e) => setFoodPrice(parseFloat(e.target.value))}
              required
              min={1}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Quantity</label>
            <input
              type="number"
              className="w-full mt-1 p-2 border rounded"
              placeholder="Enter quantity"
              value={foodQuantity}
              required
              min={1}
              onChange={(e) => setFoodQuantity(parseFloat(e.target.value))}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Food Images</label>
          <input
            type="file"
            className="w-full mt-1 p-2 border rounded"
            accept="image/*"
            required
            multiple
            onChange={handleFileChange}
          />
        </div>

        {selectedFiles.length > 0 && (
          <div className="mt-4">
            <h3 className="font-medium mb-2">Selected Images:</h3>
            <ul>
              {selectedFiles.map((file, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span>{file.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="text-red-500 text-sm underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          className={`mt-4 px-4 py-2 bg-blue-500 text-white rounded w-full md:w-auto ${isAddingFood && "opacity-50"
            }`}
          disabled={isAddingFood}
        >
          {isAddingFood ? "Adding Food..." : "Add Food"}
        </button>
      </form>

      {/* Display Foods */}
      <div className="mt-2 bg-white py-10">
        <h3 className="text-lg font-semibold mb-4 text-center">Food List</h3>
        <div>
          {
            isFoodsLoading ? (
              <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
                <PulseLoader color="#36d7b7" size={30} margin={5} />
                <p className="mt-4 text-xl font-bold text-black">Loading Foods...</p>
              </div>
            ) : error ? (
              <p className="text-center col-span-full text-red-500 text-2xl mt-20 font-bold">
                ⚠️ {error}
              </p>
            ) : foods.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {foods.map((food) => (
                  <div key={food._id} className="bg-white shadow rounded-lg p-4 flex flex-col items-center">
                    <img src={food.images[0].url} alt={food?.name} className="w-24 h-24 object-cover rounded-full mb-3" />
                    <h4 className="text-md font-bold">{food?.name}</h4>
                    <p className="text-sm text-gray-600">{food.description}</p>
                    <p className="text-sm font-medium mt-2">Category: {food.category}</p>
                    <p className="text-lg font-bold text-green-600">${food.price}</p>
                    <p className="text-sm">Quantity: {food.quantity}</p>
                    <div className="mt-4 flex space-x-2 justify-around w-full">
                      <button
                        onClick={() => handleEdit(food._id)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteFood(food._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div> 
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center col-span-full text-gray-500 text-xl">No items found.</p>
            )
          }

        </div>
      </div>
    </div>
  );
};

export default ManageFoods;
