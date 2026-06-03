import React from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
// import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const AddFood = () => {

    // const { user } = useAuth();
    const { register, handleSubmit, reset } = useForm();
    const axiosSecure = useAxiosSecure();

    const handleAddFood = async (data) => {

        // const imageFile = data.thumbnail[0];
        if (!data.thumbnail?.length) {
            return Swal.fire("Error", "Please select image", "error");
        }

        const imageFile = data.thumbnail[0];

        const formData = new FormData();
        formData.append('image', imageFile);

        const image_API_URL =
            `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`;

        // upload image
        const res = await fetch(image_API_URL, {
            method: 'POST',
            body: formData
        });

        const imageData = await res.json();

        // create food object
        const foodData = {
            name: data.name,
            description: data.description,

            pricing: {
                basePrice: Number(data.basePrice),
                discountPrice: Number(data.discountPrice)
            },

            category: {
                name: data.category
            },

            media: {
                thumbnail: imageData.data.display_url
            },

            foodAttributes: {
                isVeg: data.isVeg === "true",
                spiceLevel: data.spiceLevel,
                calories: Number(data.calories)
            },

            availability: {
                isAvailable: data.isAvailable === "true",
                preparationTime: Number(data.preparationTime)
            },

            // ingredients: data.ingredients.split(','),
            // tags: data.tags.split(','),
            ingredients: data.ingredients
                ? data.ingredients.split(',').map(item => item.trim())
                : [],

            tags: data.tags
                ? data.tags.split(',').map(item => item.trim())
                : [],

            //     // createdBy: user?.email
        };

        // console.log('foodddddd', foodData);

        Swal.fire({
            title: "Add Food Item?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes Add"
        }).then(async (result) => {

            if (result.isConfirmed) {

                await axiosSecure.post('/menu', foodData);

                Swal.fire("Added!", "Food item added successfully", "success");

                reset();
            }
        });
    };

    return (
        <form
            onSubmit={handleSubmit(handleAddFood)}
            className='p-4 sm:p-6 shadow-lg border w-full md:w-3/4 lg:w-1/2 mx-auto my-6 md:my-10 rounded-lg'
        >

            <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 md:mb-6'>
                Add Food
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

                {/* Food Name */}
                <div>
                    <label className="label">Food Name</label>
                    <input {...register("name", { required: true })}
                        className="input w-full" />
                </div>

                {/* Category */}
                <div>
                    <label className="label">Category</label>
                    <select {...register("category")}
                        className="select w-full">
                        <option>Chicken</option>
                        <option>Burger</option>
                        <option>Pizza</option>
                        <option>Drinks</option>
                        <option>Dessert</option>
                    </select>
                </div>

                {/* Description - full width */}
                <div className="md:col-span-2">
                    <label className="label">Description</label>
                    <textarea {...register("description")}
                        className="textarea w-full" />
                </div>

                {/* Price */}
                <div>
                    <label className="label">Base Price</label>
                    <input type="number"
                        {...register("basePrice")}
                        className="input w-full" />
                </div>

                <div>
                    <label className="label">Discount Price</label>
                    <input type="number"
                        {...register("discountPrice")}
                        className="input w-full" />
                </div>

                {/* Thumbnail */}
                <div className="md:col-span-2">
                    <label className="label">Thumbnail Image</label>
                    <input type="file"
                        {...register("thumbnail")}
                        className="file-input w-full" />
                </div>

                {/* Veg */}
                <div>
                    <label className="label">Veg / Non Veg</label>
                    <select {...register("isVeg")}
                        className="select w-full">
                        <option value="false">Non Veg</option>
                        <option value="true">Veg</option>
                    </select>
                </div>

                {/* Spice Level */}
                <div>
                    <label className="label">Spice Level</label>
                    <select {...register("spiceLevel")}
                        className="select w-full">
                        <option>low</option>
                        <option>medium</option>
                        <option>high</option>
                    </select>
                </div>

                {/* Calories */}
                <div>
                    <label className="label">Calories</label>
                    <input type="number"
                        {...register("calories")}
                        className="input w-full" />
                </div>

                {/* Preparation Time */}
                <div>
                    <label className="label">Preparation Time (Minutes)</label>
                    <input type="number"
                        {...register("preparationTime")}
                        className="input w-full" />
                </div>

                {/* Availability */}
                <div>
                    <label className="label">Availability</label>
                    <select {...register("isAvailable")}
                        className="select w-full">
                        <option value="true">Available</option>
                        <option value="false">Not Available</option>
                    </select>
                </div>

                {/* Ingredients */}
                <div>
                    <label className="label">Ingredients</label>
                    <input {...register("ingredients")}
                        className="input w-full"
                        placeholder="Chicken, Cheese, Sauce" />
                </div>

                {/* Tags */}
                <div className="md:col-span-2">
                    <label className="label">Tags</label>
                    <input {...register("tags")}
                        className="input w-full"
                        placeholder="popular, chef-special" />
                </div>

            </div>

            <button className="btn bg-primary w-full mt-6">
                Add Food
            </button>

        </form>
    );
};

export default AddFood;
