import React, { useState } from "react";
import { useForm } from "react-hook-form";
// import useAuth from "@/hooks/useAuth";
// import useAxiosSecure from "@/hooks/useAxiosSecure";
// import axios from "axios";

export default function ProfileDashboard() {
    // const { user, updateUserProfile } = useAuth();
    // const axiosSecure = useAxiosSecure();

    // const [preview, setPreview] = useState(user?.photoURL);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            // name: user?.displayName
        }
    });

    const handleImagePreview = (file) => {
        if (!file) return;
        const reader = new FileReader();
        // reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
    };

    const onSubmit = async (data) => {
        try {
            setLoading(true);

            // let photoURL = user?.photoURL;

            if (data.photo?.length > 0) {
                const formData = new FormData();
                formData.append("image", data.photo[0]);

                // const res = await axios.post(
                    // `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_UPLOAD_KEY}`,
                    // formData
                // );

                // photoURL = res.data.data.url;
            }

            // await updateUserProfile({
            //     displayName: data.name,
            //     photoURL
            // });

            // await axiosSecure.patch(`/users/${user.email}`, {
            //     displayName: data.name,
            //     photoURL
            // });

            alert("Profile updated successfully ✅");
            setLoading(false);
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6">
            <div className="grid md:grid-cols-2 gap-8">

                {/* Profile Card */}
                <div className="bg-base-100 shadow-xl rounded-2xl p-6">
                    <div className="flex flex-col items-center space-y-4">
                        <img
                            src={
                                // preview
                                 "https://i.ibb.co/4pDNDk1/avatar.png"}
                            className="w-40 h-40 rounded-full object-cover border-4 border-primary"
                        />

                        {/* <h2 className="text-2xl font-bold">{user?.displayName}</h2> */}
                        {/* <p className="text-gray-500">{user?.email}</p> */}
                    </div>
                </div>

                {/* Update Form */}
                <div className="bg-base-100 shadow-xl rounded-2xl p-6">
                    <h2 className="text-2xl font-bold mb-6">Update Profile</h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="font-semibold">Name</label>
                            <input
                                className="input input-bordered w-full mt-1"
                                {...register("name", { required: true })}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm">Name is required</p>
                            )}
                        </div>

                        {/* Photo */}
                        <div>
                            <label className="font-semibold">Profile Photo</label>
                            <input
                                type="file"
                                className="file-input file-input-bordered w-full mt-1"
                                {...register("photo")}
                                onChange={(e) => handleImagePreview(e.target.files[0])}
                            />
                        </div>

                        <button
                            disabled={loading}
                            className="btn btn-primary w-full"
                        >
                            {loading ? "Updating..." : "Update Profile"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
