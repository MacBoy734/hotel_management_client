"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux"
import { logout } from "../../../../slices/authSlice"
import { toast } from "react-toastify";

export default function EditProduct() {
    const { user, status } = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const { id } = useParams();
    const router = useRouter();
    const [product, setProduct] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isSavingProduct, setIsSavingProduct] = useState(false);
    const [offers, setOffers] = useState([])

    const categories = ["Breakfast", "Lunch", "Dinner", "Drinks", "Snacks"];
    useEffect(() => {
        if (status !== "loading" && (!user || !user.isAdmin)) {
            dispatch(logout())
            router.push("/unauthorized")
        }
    }, [user, status, router])

    useEffect(() => {
        if (!id) return;

        async function fetchProduct() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/foods/${id}`);
                const data = await res.json();
                if (!res.ok) {
                    const { error } = await res.json()
                    if (res.status === 403) {
                        dispatch(logout())
                        router.replace('/auth/login')
                        toast.error(error)
                        return
                    }
                    toast.error(error)
                    return
                }
                setProduct(data);
            } catch (err) {
                toast.error(err.message);
                router.push("/admin");
            }
        }
        fetchProduct()
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!product?.name?.trim()) return toast.error("Product name is required.");
        if (!product?.category?.trim()) return toast.error("Product category is required.");
        if (product?.price <= 0) return toast.error("Product price must be greater than zero.");
        if (product?.quantity < 0) return toast.error("Product quantity cannot be negative.");
        // if (selectedFiles.length === 0) return toast.error("Please select at least one image.");

        const formData = new FormData();
        formData.append("name", product.name.trim());
        formData.append("isAvailable", product.isAvailable);
        formData.append("description", product.description.trim());
        formData.append("price", product.price);
        formData.append("quantity", product.quantity);
        formData.append("category", product.category.trim())

        try {
            setIsSavingProduct(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/foods/editfood/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(product),
                credentials: "include",
            });

            if (!response.ok) {
                const { error } = await response.json()
                if(response.status === 403){
                  dispatch(logout())
                  router.replace('/auth/login')
                  toast.error(error)
                  return
                }
                toast.error(error)
                return
              }

            toast.success("Product updated successfully!");
            router.push("/menu")
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsSavingProduct(false);
        }
    };

    if (!product) return <p className="text-center mt-10">Loading...</p>;

    return (
        <div className="max-w-3xl mx-auto bg-white p-6 shadow-lg rounded-lg my-10 text-black">
            <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Product Name</label>
                    <input
                        type="text"
                        name="name"
                        className="w-full mt-1 p-2 border rounded"
                        placeholder="Enter product name"
                        value={product.name || ""}
                        required
                        onChange={(e) => setProduct({ ...product, name: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Product Category</label>
                    <select
                        name="category"
                        className="w-full mt-1 p-2 border rounded"
                        value={product.category || ""}
                        onChange={(e) => setProduct({ ...product, category: e.target.value })}
                        required
                    >
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium">Description</label>
                    <textarea
                        name="description"
                        className="w-full mt-1 p-2 border rounded"
                        rows={6}
                        placeholder="Enter product description"
                        required
                        minLength={20}
                        value={product.description || ""}
                        onChange={(e) => setProduct({ ...product, description: e.target.value })}
                    ></textarea>
                </div>
                <div>
                    <label className="block text-sm font-medium">Price (USD)</label>
                    <input
                        type="number"
                        name="price"
                        className="w-full mt-1 p-2 border rounded"
                        placeholder="Enter product price"
                        value={product.price || ""}
                        onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) })}
                        required
                        min={1}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Quantity</label>
                    <input
                        type="number"
                        name="quantity"
                        className="w-full mt-1 p-2 border rounded"
                        placeholder="Enter product quantity"
                        value={product.quantity || ""}
                        required
                        min={1}
                        onChange={(e) => setProduct({ ...product, quantity: parseFloat(e.target.value) })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">is Available?</label>
                    <input
                        type="checkbox"
                        name="isAvailable"
                        checked={product.isAvailable || false}
                        onChange={(e) => setProduct({ ...product, isAvailable: e.target.checked })}
                    />
                </div>
                <button
                    type="submit"
                    className={`w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 ${isSavingProduct && 'opacity-50'}`}
                    disabled={isSavingProduct}
                >
                    {isSavingProduct ? "Updating..." : "Update Product"}
                </button>
            </form>
        </div>
    );
}
