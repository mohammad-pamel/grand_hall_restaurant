// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import useAuth from "../../../hooks/useAuth";
// import { useQuery } from '@tanstack/react-query';
// import useAxiosSecure from '../../../hooks/useAxiosSecure';
// // import axios from "axios";

// export default function ProfileDashboard() {
//     const { user, updateUserProfile } = useAuth();
//     const axiosSecure = useAxiosSecure();

//     // const [preview, setPreview] = useState(user?.photoURL);
//     const [loading, setLoading] = useState(false);

//     const { data: users = [] } = useQuery({
//         queryKey: ['users', user?._id],
//         enabled: !!user && !loading,
//         queryFn: async () => {
//             const res = await axiosSecure.get(`/users?email=${user.email}`);
//             console.log("my-orders", res.data);
//             return res.data;
//         }
//     });

//     const dbUser = users.find(
//         u => u.email === user?.email
//     );

//     console.log("db", dbUser)

//     console.log("profile users", users)

//     const {
//         register,
//         handleSubmit,
//         formState: { errors }
//     } = useForm({
//         defaultValues: {
//             name: user?.displayName
//         }
//     });

//     const handleImagePreview = (file) => {
//         if (!file) return;
//         const reader = new FileReader();
//         // reader.onloadend = () => setPreview(reader.result);
//         reader.readAsDataURL(file);
//     };

//     const onSubmit = async (data) => {
//         try {
//             setLoading(true);

//             let photoURL = user?.photoURL;

//             if (data.photo?.length > 0) {
//                 const formData = new FormData();
//                 formData.append("image", data.photo[0]);

//                 const res = await axiosSecure.post(
//                 `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_UPLOAD_KEY}`,
//                 formData
//                 );

//                 photoURL = res.data.data.url;
//             }

//             await updateUserProfile({
//                 displayName: data.name,
//                 photoURL
//             });

//             await axiosSecure.patch(`/users/${user.email}`, {
//                 displayName: data.name,
//                 photoURL
//             });

//             alert("Profile updated successfully ✅");
//             setLoading(false);
//         } catch (err) {
//             console.log(err);
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="max-w-5xl mx-auto p-6">
//             <div className="border-2 w-full max-w-sm mx-auto shrink-0 shadow-2xl">

//                 {/* Profile Card */}
//                 <div className="bg-base-100 shadow-xl rounded-2xl p-6">
//                     <div className="flex flex-col items-center space-y-4">
//                         <img
//                             src={dbUser ? dbUser?.photoURL :
//                                 // preview
//                                 "https://i.ibb.co/4pDNDk1/avatar.png"}
//                             className="w-40 h-40 rounded-full object-cover border-4 border-primary"
//                         />

//                         {/* <h2 className="text-2xl font-bold">{user?.displayName}</h2> */}
//                         {/* <p className="text-gray-500">{user?.email}</p> */}
//                     </div>
//                 </div>

//                 {/* Update Form */}
//                 <div className="bg-base-100 shadow-xl rounded-2xl p-6">
//                     <h2 className="text-2xl font-bold mb-6">Update Profile</h2>

//                     <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//                         {/* Name */}
//                         <div>
//                             <label className="font-semibold">Name</label>
//                             <input
//                                 defaultValue={dbUser?.displayName}
//                                 className="input input-bordered w-full mt-1"
//                                 {...register("name", { required: true })}
//                             />
//                             {errors.name && (
//                                 <p className="text-red-500 text-sm">Name is required</p>
//                             )}
//                         </div>

//                         {/* Photo */}
//                         <div>
//                             <label className="font-semibold">Profile Photo</label>
//                             <input
//                                 type="file"
//                                 className="file-input file-input-bordered w-full mt-1"
//                                 {...register("photo")}
//                                 onChange={(e) => handleImagePreview(e.target.files[0])}
//                             />
//                         </div>

//                         <button
//                             disabled={loading}
//                             className="btn btn-primary w-full"
//                         >
//                             {loading ? "Updating..." : "Update Profile"}
//                         </button>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// }















import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

export default function ProfileDashboard() {
    const { user, updateUserProfile } = useAuth();
    const axiosSecure = useAxiosSecure();

    const [updating, setUpdating] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();

    const {
        data: users = [],
        refetch,
        isLoading
    } = useQuery({
        queryKey: ["users", user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(
                `/users?email=${user.email}`
            );
            return res.data;
        }
    });

    const dbUser = users.find(
        (u) => u.email === user?.email
    );

    useEffect(() => {
        if (dbUser) {
            reset({
                name: dbUser.displayName || ""
            });
        }
    }, [dbUser, reset]);

    const onSubmit = async (data) => {
        try {
            setUpdating(true);

            let photoURL =
                dbUser?.photoURL ||
                user?.photoURL ||
                "";

            if (data.photo?.[0]) {
                const formData = new FormData();
                formData.append("image", data.photo[0]);

                const imageRes = await axios.post(
                    `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`,
                    formData
                );

                photoURL = imageRes.data.data.url;
            }

            await updateUserProfile({
                displayName: data.name,
                photoURL
            });

            await axiosSecure.patch(
                `/users/${user.email}`,
                {
                    displayName: data.name,
                    photoURL
                }
            );

            await refetch();

            alert("Profile updated successfully ✅");
        } catch (error) {
            console.error(error);
            alert("Failed to update profile");
        } finally {
            setUpdating(false);
        }
    };

    if (isLoading) {
        return (
            <div className="text-center py-10">
                Loading Profile...
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-6">
            <div className="border-2 w-full max-w-sm mx-auto shadow-2xl rounded-2xl">

                {/* Profile Card */}
                <div className="bg-base-100 p-6">
                    <div className="flex flex-col items-center gap-4">

                        <img
                            src={
                                dbUser?.photoURL ||
                                user?.photoURL ||
                                "https://i.ibb.co/4pDNDk1/avatar.png"
                            }
                            alt="Profile"
                            className="w-40 h-40 rounded-full object-cover border-4 border-primary"
                        />

                        <h2 className="text-xl font-bold">
                            {dbUser?.displayName ||
                                user?.displayName}
                        </h2>

                        <p className="text-gray-500 text-sm">
                            {user?.email}
                        </p>

                    </div>
                </div>

                {/* Update Form */}
                <div className="bg-base-100 p-6 border-t">
                    <h2 className="text-2xl font-bold mb-6">
                        Update Profile
                    </h2>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                    >

                        {/* Name */}
                        <div>
                            <label className="font-semibold">
                                Name
                            </label>

                            <input
                                className="input input-bordered w-full mt-1"
                                {...register("name", {
                                    required: "Name is required"
                                })}
                            />

                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        {/* Photo */}
                        <div>
                            <label className="font-semibold">
                                Profile Photo
                            </label>

                            <input
                                type="file"
                                accept="image/*"
                                className="file-input file-input-bordered w-full mt-1"
                                {...register("photo")}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={updating}
                            className="btn bg-primary text-secondary hover:bg-secondary hover:text-primary w-full"
                        >
                            {updating
                                ? "Updating..."
                                : "Update Profile"}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
}