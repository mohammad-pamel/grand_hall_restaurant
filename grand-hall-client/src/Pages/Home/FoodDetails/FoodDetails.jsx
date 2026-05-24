import React from 'react';
import { useParams } from 'react-router';
// import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';
import useAuth from '../../../hooks/useAuth';

const FoodDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch food details
  const { data: food = {}, isLoading } = useQuery({
    queryKey: ['food', id],
    enabled: !!id,
    queryFn: async () => {
      const res = await axiosSecure.get(`/menu/${id}`);
      return res.data;
    }
  });

 const handleAddToCart = async () => {

  if (!user) {
    Swal.fire({
      title: "Please login first",
      icon: "warning"
    })
    navigate("/login")
    return
  }

  const cartItem = {
    foodId: food._id,
    name: food.name,
    // image: food.media.thumbnail,
    image: food?.media?.thumbnail,
    price: food.pricing.discountPrice || food.pricing.basePrice,
    quantity: 1,
    email: user.email
  }

  try {

    const res = await axiosSecure.post("/cart", cartItem)

    if (res.data.insertedId) {
      Swal.fire({
        icon: "success",
        title: "Added to cart 🛒"
      })
    }

  } catch (err) {
    console.log(err)
  }

}

  // Handle Bkash Payment
  // const handleBkashPayment = async (orderId, amount) => {
  //   try {
  //     // 1️⃣ Create Payment
  //     const { data: createRes } = await axiosSecure.post('/create-payment', {
  //       orderId,
  //       amount
  //     });

  //     const paymentID = createRes.paymentID;

  //     // 2️⃣ Execute Payment
  //     const { data: executeRes } = await axiosSecure.post('/execute-payment', {
  //       paymentID,
  //       orderId
  //     });

  //     if (executeRes.transactionStatus === 'Completed') {
  //       Swal.fire('Success', 'Payment Successful ✅', 'success');
  //     } else {
  //       Swal.fire('Failed', 'Payment Failed ❌', 'error');
  //     }

  //   } catch (err) {
  //     console.log(err);
  //     Swal.fire('Error', 'Payment Error ❌', 'error');
  //   }
  // };

  // Place Order & Pay
  // const handleOrderAndPay = async () => {
  //   if (!user) {
  //     Swal.fire({
  //       title: "Login Required",
  //       text: "Please login to place order",
  //       icon: "warning"
  //     });
  //     navigate('/login');
  //     return;
  //   }

  //   const orderData = {
  //     foodId: food._id,
  //     foodName: food.name,
  //     foodImage: food.media.thumbnail,
  //     price: food.pricing.discountPrice || food.pricing.basePrice,
  //     quantity: 1,
  //     totalPrice: food.pricing.discountPrice || food.pricing.basePrice,
  //     customerEmail: user.email,
  //     customerName: user.displayName,
  //     status: 'pending',
  //     paymentStatus: 'unpaid'
  //   };

  //   try {
  //     // 1️⃣ Place Order
  //     const { data: orderRes } = await axiosSecure.post('/orders', orderData);

  //     Swal.fire({
  //       icon: "success",
  //       title: "Order Placed!",
  //       text: "Your food is being prepared 🍽️"
  //     });

  //     // 2️⃣ Pay with Bkash
  //     await handleBkashPayment(orderRes.insertedId, orderData.totalPrice);

  //   } catch (err) {
  //     console.log(err);
  //     Swal.fire('Error', 'Something went wrong', 'error');
  //   }
  // };

  // Just place order without payment
  // const handleOrderOnly = async () => {
  //   if (!user) {
  //     Swal.fire({
  //       title: "Login Required",
  //       text: "Please login to place order",
  //       icon: "warning"
  //     });
  //     navigate('/login');
  //     return;
  //   }

  //   const orderData = {
  //     foodId: food._id,
  //     foodName: food.name,
  //     foodImage: food.media.thumbnail,
  //     price: food.pricing.discountPrice || food.pricing.basePrice,
  //     quantity: 1,
  //     totalPrice: food.pricing.discountPrice + 100 || food.pricing.basePrice + 100,
  //     customerEmail: user.email,
  //     customerName: user.displayName,
  //     status: 'pending',
  //     paymentStatus: 'unpaid'
  //   };

  //   try {
  //     await axiosSecure.post('/orders', orderData);

  //     Swal.fire({
  //       icon: "success",
  //       title: "Order Placed!",
  //       text: "Your food is being prepared 🍽️"
  //     });

  //   } catch (err) {
  //     console.log(err);
  //     Swal.fire('Error', 'Something went wrong', 'error');
  //   }
  // };

  if (isLoading) {
    return <p className="text-center py-20 text-xl">Loading...</p>;
  }

  return (
    <div className="w-11/12 mx-auto py-14">

      <div className="grid md:grid-cols-2 gap-10 items-center">

        {/* Image */}
        <img
          src={food?.media?.thumbnail}
          alt={food?.name}
          className="w-full rounded-2xl shadow-lg"
        />

        {/* Content */}
        <div className="space-y-4">

          <h2 className="text-4xl font-bold">{food?.name}</h2>

          <p className="text-lg text-gray-500">
            Category: {food?.category?.name}
          </p>

          <p className="text-gray-700">{food?.description}</p>

          {/* Price */}
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-primary">
              Tk. {food?.pricing?.discountPrice ?? food?.pricing?.basePrice}
            </span>
            {food?.pricing?.discountPrice && (
              <span className="line-through text-gray-400">
                Tk. {food?.pricing?.basePrice}
              </span>
            )}
          </div>

          <p><strong>Type:</strong> {food?.foodAttributes?.isVeg ? "Veg" : "Non-Veg"}</p>
          <p><strong>Spice Level:</strong> {food?.foodAttributes?.spiceLevel}</p>
          <p><strong>Calories:</strong> {food?.foodAttributes?.calories}</p>
          <p><strong>Preparation Time:</strong> {food?.availability?.preparationTime} Minutes</p>
          <p><strong>Status:</strong> {food?.availability?.isAvailable ? "Available" : "Not Available"}</p>

          {/* Ingredients */}
          <div>
            <strong>Ingredients:</strong>
            <ul className="list-disc ml-6 mt-2">
              {/* {food?.ingredients?.map((item, index) => ( */}
              {/* (Array.isArray(food?.ingredients) ? food.ingredients : []) */}
              {food?.ingredients?.map((item, index) => (
                <li key={index}>{item.trim()}</li>
              ))}
            </ul>
          </div>

          {/* Tags */}
          <div>
            <strong>Tags:</strong>
            <div className="flex gap-2 mt-2">
              {food?.tags?.map((tag, index) => (
                <span key={index} className="badge badge-outline">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Buttons */}
          {/* <button
            onClick={handleOrderOnly}
            className='btn bg-primary hover:bg-secondary hover:text-primary text-secondary w-full mt-4'
          >
            Order Now
          </button> */}

          {/* <button
            onClick={handleOrderAndPay}
            className='btn bg-primary hover:bg-secondary hover:text-primary text-secondary w-full mt-4'
          >
            Order & Pay with Bkash
          </button> */}

          <button
            onClick={handleAddToCart}
            className="btn bg-primary hover:bg-secondary text-secondary hover:text-primary w-full"
          >
            Add To Cart 🛒
          </button>

        </div>

      </div>
    </div>
  );
};

export default FoodDetails;