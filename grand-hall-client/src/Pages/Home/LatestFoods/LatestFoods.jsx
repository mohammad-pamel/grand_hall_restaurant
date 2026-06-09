import React from 'react';
// import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { NavLink, useNavigate } from 'react-router';

const LatestFoods = () => {

    // const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const { data: foods = [] } = useQuery({
        queryKey: ['foods'],
        queryFn: async () => {
            const res = await axiosSecure.get('/latest-foods');
            return res.data;
        }
    });

    // ⭐ View Details Button
    const handleDetailsBtn = (id) => {
        // if (!user) {
        //     navigate('/login');
        // }
        // else {
            // }
                navigate(`/food-details/${id}`);
    };

    return (
        <div>
            <div className='mt-14 w-11/12 mx-auto'>

                <h2 className='text-4xl font-bold'>Latest Foods</h2>

                <div className='mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>

                    {
                        foods.map(food =>
                            food?.availability?.isAvailable && (

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

                {/* VIEW ALL BUTTON */}
                <div className='my-10 flex justify-center'>
                    <NavLink to='/all-foods'>
                        <button className='btn bg-primary hover:bg-secondary text-secondary hover:text-primary'>
                            View All Foods
                        </button>
                    </NavLink>
                </div>

            </div>
        </div>
    );
};

export default LatestFoods;
