import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import { Link } from 'react-router';

const Cart = () => {

    //   const axiosSecure = axios.create({
    //     baseURL: "http://localhost:5000"
    //   });
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();


    const { data: cart = [], refetch } = useQuery({
        queryKey: ["cart", user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/cart?email=${user.email}`);
            return res.data;
        }
    });

    // Increase Quantity
    const handleIncrease = async (item) => {
        const res = await axiosSecure.patch(`/cart/increase/${item._id}`);
        if (res.data.modifiedCount) {
            refetch();
        }
    };

    // Decrease Quantity
    const handleDecrease = async (item) => {
        if (item.quantity === 1) return;

        const res = await axiosSecure.patch(`/cart/decrease/${item._id}`);
        if (res.data.modifiedCount) {
            refetch();
        }
    };

    // Delete Item
    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "Remove item?",
            text: "This food will be removed from cart",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes Delete"
        });

        if (confirm.isConfirmed) {
            const res = await axiosSecure.delete(`/cart/${id}`);

            if (res.data.deletedCount) {
                Swal.fire("Deleted!", "Item removed", "success");
                refetch();
            }
        }
    };

    // Total Price
    const totalPrice = cart.reduce((total, item) => {
        return total + item.price * item.quantity;
    }, 0);

   return (
  <div className="w-full max-w-5xl mx-auto px-3 md:px-6 py-6">

    <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">
      My Cart ({cart.length})
    </h1>

    <div className="space-y-4">

      {cart.map((item) => (

        <div
          key={item._id}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border p-4 rounded-lg shadow"
        >

          {/* LEFT SECTION */}
          <div className="flex items-center gap-3 md:gap-4">

            <img
              src={item.image}
              alt=""
              className="w-16 h-16 md:w-20 md:h-20 rounded object-cover"
            />

            <div>
              <h2 className="font-semibold text-sm md:text-base">
                {item.name}
              </h2>
              <p className="text-sm md:text-base">
                ${item.price}
              </p>
            </div>

          </div>

          {/* RIGHT SECTION */}
          <div className="flex flex-wrap items-center justify-between md:justify-end gap-3">

            {/* Quantity */}
            <div className="flex items-center gap-2">

              <button
                onClick={() => handleDecrease(item)}
                className="px-2 md:px-3 py-1 bg-primary text-white rounded"
              >
                -
              </button>

              <span className="text-sm md:text-base">
                {item.quantity}
              </span>

              <button
                onClick={() => handleIncrease(item)}
                className="px-2 md:px-3 py-1 bg-primary text-white rounded"
              >
                +
              </button>

            </div>

            {/* Subtotal */}
            <div className="font-semibold text-sm md:text-base whitespace-nowrap">
            ৳ {item.price * item.quantity}
            </div>

            {/* Delete */}
            <button
              onClick={() => handleDelete(item._id)}
              className="bg-red-600 hover:bg-red-400 text-white px-3 py-1 rounded text-sm md:text-base"
            >
              Delete
            </button>

          </div>

        </div>

      ))}

    </div>

    {/* TOTAL SECTION */}

    <div className="mt-6 md:mt-8 border-t pt-4 md:pt-6 flex flex-col md:flex-row justify-between items-center gap-4">

      <h2 className="text-xl md:text-2xl font-bold">
        Total: ৳{totalPrice + 100}
      </h2>

      <Link to="/checkout">
        <button className="w-full md:w-auto bg-primary hover:bg-secondary text-secondary hover:text-primary px-6 py-3 rounded-lg">
          Proceed To Checkout
        </button>
      </Link>

    </div>

  </div>
);
};

export default Cart;