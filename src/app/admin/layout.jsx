"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { PulseLoader } from "react-spinners";

export default function AdminLayout({ children }) {
    const router = useRouter();
    const { user, status } = useSelector((state) => state.auth);

    useEffect(() => {
        if (status !== "loading" && (!user || !user.isAdmin)) {
            router.replace("/unauthorized");
        }
    }, [user, status, router]);

    if (status === "loading") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] w-full">
                <PulseLoader color="#36d7b7" size={20} margin={5} />
                <p className="mt-4 text-xl font-bold text-black">Loading...</p>
            </div>
        );
    }

    if (!user || !user.isAdmin) return null

    return <>{children}</>;
}
