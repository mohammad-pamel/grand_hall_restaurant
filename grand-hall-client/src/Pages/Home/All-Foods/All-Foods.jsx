import React from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../../hooks/useAuth';
import { useNavigate } from 'react-router';

const AllFoods = () => {

    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const { data: foods = [] } = useQuery({
        queryKey: ['foods'],
        queryFn: async () => {
            const res = await axiosSecure.get('/menu');
            return res.data;
        }
    });

    const handleDetailsBtn = (id) => {
        if (!user) {
            navigate('/login');
        }
        else {
            // navigate(`/food-details/${id}`);
            navigate('/login', { state: { from: `/food-details/${id}` } });
        }
    };

    return (
        <div>

            <div className='w-11/12 mx-auto py-14'>

                <h2 className='text-3xl font-bold my-10'>
                    All Foods: {foods.length}
                </h2>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>

                    {
                        foods
                            .filter(food => food?.availability?.isAvailable)
                            .map(food => (
                                <div key={food._id} className="card flex flex-col p-3 rounded-2xl shadow-xl border-4 border-amber-700 hover:scale-105">

                                    {/* Image */}
                                    <figure className='rounded-2xl'>
                                        <img
                                            src={food?.media?.thumbnail}
                                            alt={food?.name}
                                            className='h-56 w-full object-cover rounded-2xl'
                                        />
                                    </figure>

                                    {/* Info */}
                                    <div className="mt-3 flex-1 flex flex-col items-center">

                                        <h2 className="card-title font-bold text-2xl text-center">
                                            {food?.name}
                                        </h2>

                                        <p className='text-sm text-gray-500 text-center'>
                                            {food?.category?.name}
                                        </p>

                                        <p className='text-xl font-bold mt-1 text-center'>
                                            Tk. {food?.pricing?.discountPrice || food?.pricing?.basePrice}
                                            {food?.pricing?.discountPrice && (
                                                <span className='line-through text-gray-400 ml-2 text-sm'>
                                                    Tk. {food?.pricing?.basePrice}
                                                </span>
                                            )}
                                        </p>

                                    </div>

                                    {/* Button */}
                                    <div className="card-actions justify-center mt-3">
                                        <button
                                            onClick={() => handleDetailsBtn(food._id)}
                                            className="btn w-full bg-primary text-secondary hover:bg-secondary hover:text-primary"
                                        >
                                            View More
                                        </button>
                                    </div>

                                </div>
                            )
                            )
                    }

                </div>

            </div>

        </div>
    );
};

export default AllFoods;
