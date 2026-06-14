import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import Swal from 'sweetalert2';
import { useState } from 'react';
import Forbidden from '../../../Components/Forbidden/Forbidden';

const MyOrders = () => {

  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { data: orders = [], refetch, isLoading } = useQuery({
    queryKey: ['orders', user?.email],
    enabled: !!user && !loading,
    queryFn: async () => {
      const res = await axiosSecure.get(`/orders?email=${user.email}`);
      // console.log("my-orders", res.data);
      return res.data;
    }
  });


  const { data: users = [], isLoading: usersLoading
    // error 
  } = useQuery({
    queryKey: ['users', user?.email],
    enabled: !!user && !loading,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users?email=${user.email}`);
      return res.data;
    }
  });

  if (usersLoading) {
    return <span className="loading loading-infinity loading-xl my-14"></span>;
  }


  const dbUser = users.find(
    u => u.email === user?.email
  );

  // console.log("dbuders", dbUser)

  if (!dbUser) {
    return <Forbidden></Forbidden>
  }

  // Cancel order
  const handleCancelOrder = async (id) => {

    const confirm = await Swal.fire({
      title: "Cancel Order?",
      text: "You can cancel only pending orders",
      icon: "warning",
      showCancelButton: true
    });

    if (!confirm.isConfirmed) return;

    await axiosSecure.patch(`/orders/${id}`, { status: 'cancelled' });

    refetch();

    Swal.fire("Cancelled!", "Your order has been cancelled", "success");
  };

  const statusColor = (status) => {
    const s = status?.toLowerCase();

    if (s === 'pending') return 'bg-yellow-400';
    if (s === 'preparing') return 'bg-blue-500';
    if (s === 'delivered') return 'bg-green-600';
    if (s === 'cancelled') return 'bg-red-500';

    return 'bg-gray-400';
  };

  const paymentStatusColor = (paymentStatus) => {

    const s = paymentStatus?.toLowerCase();

    if (s === 'paid') return 'bg-green-600';
    if (s === 'unpaid') return 'bg-red-500';

    return 'bg-gray-400';
  };


  const paymentBkash = async (order) => {
  try {
    console.log("order bkash", order)

    const response = await axiosSecure.post(
      '/paymentBkash',
      { orderId: order._id }
    );

    console.log("FULL RESPONSE:", response);
    console.log("DATA:", response.data);

    if (response.data?.url) {
      window.location.replace(response.data.url);
    } else {
      Swal.fire("Error", "Payment URL missing");
    }

  } catch (error) {
    console.log("PAYMENT ERROR:", error);
    console.log("SERVER ERROR:", error?.response?.data);
  }
};

  if (isLoading) {
    return <span className="loading loading-infinity loading-xl my-14"></span>;
  }

  return (

    <div className='w-full md:w-11/12 mx-auto px-3 md:px-0 py-8 md:py-14'>

      <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
        My Orders: {orders.length}
      </h2>

      <div className="overflow-x-auto rounded-lg border">

        <table className="table table-sm md:table-md w-full">

          <thead>

            <tr className="text-xs md:text-sm text-center">
              <th>No</th>
              <th className="min-w-[180px]">Food</th>
              <th className="whitespace-nowrap">Total</th>
              <th>Status</th>
              <th>Payment Status</th>
              {/* <th>Payment</th> */}
              <th className="hidden md:table-cell">Date</th>
              <th>Action</th>
            </tr>

          </thead>

          <tbody className="text-center">

            {orders.map((order, index) => (

              <tr key={order._id} className="text-xs md:text-sm">

                <td>{index + 1}</td>

                {/* FOOD */}
                <td className="min-w-[180px]">

                  <div className="flex items-center gap-2 md:gap-3">

                    <img
                      src={order.items?.[0]?.foodImage}
                      className="w-10 h-10 md:w-14 md:h-14 rounded object-cover"
                    />

                    <div>

                      <p className="font-semibold">
                        {order.items?.[0]?.foodName}
                      </p>

                      {order.items?.length > 1 && (

                        <p className="text-[10px] md:text-xs opacity-60">
                          +{order.items.length - 1} more items
                        </p>

                      )}

                    </div>

                  </div>

                </td>

                {/* TOTAL */}
                <td className="whitespace-nowrap font-semibold">
                  ৳ {order.orderTotal}
                </td>

                {/* STATUS */}
                <td>

                  <span
                    className={`text-secondary text-xs md:text-sm p-2 rounded ${statusColor(order.status)}`}
                  >
                    {order.status}
                  </span>

                </td>

                {/* PAYMENT */}
                {/* <td>

                  <span
                    className={`text-secondary text-xs md:text-sm p-2 rounded ${paymentStatusColor(order.paymentStatus)}`}
                  >
                    {order.paymentStatus}
                  </span>

                </td> */}
                <td>

                  {order.paymentStatus === 'unpaid' && <button onClick={() => paymentBkash(order)} className='bg-primary hover:bg-secondary hover:text-primary text-secondary p-2 rounded'>Pay Now</button>}
                  {/* <button onClick={() => paymentBkash(order)} className='bg-primary text-secondary p-2'>Pay Now</button> */}
                  {order.paymentStatus === 'paid' && <button className={`text-secondary text-xs md:text-sm p-2 rounded ${paymentStatusColor(order.paymentStatus)}`}>Paid</button>}

                  {/* <span
                  className={`text-white text-xs md:text-sm p-2  rounded ${paymentStatusColor(order.paymentStatus)}`}
                >
                  {order.paymentStatus}
                </span> */}

                </td>

                {/* DATE (hidden mobile) */}
                <td className="hidden md:table-cell whitespace-nowrap">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>

                {/* ACTION */}
                <td className="align-middle text-center">
                  <div className="flex flex-col md:flex-row items-center justify-center gap-2">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="btn btn-xs md:btn-sm bg-primary text-secondary hover:bg-secondary hover:text-primary"
                    >
                      Details
                    </button>

                    {order.status?.toLowerCase() === 'pending' ? (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        className="btn btn-xs md:btn-sm bg-red-500 text-secondary hover:bg-red-600"
                      >
                        Cancel
                      </button>
                    ) : (
                      <span className="bg-red-600 text-secondary p-2 rounded text-[10px] md:text-xs">
                        Not Allowed
                      </span>
                    )}
                  </div>
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* MODAL */}

      {selectedOrder && (

        <div className="fixed inset-0 bg-black/40 flex justify-center items-center px-3">

          <div className="bg-base-200 p-4 md:p-6 rounded w-full max-w-lg max-h-[85vh] overflow-y-auto">

            <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">
              Order Details
            </h3>

            <p><b>Name:</b> {selectedOrder.customerName}</p>
            <p><b>Email:</b> {selectedOrder.customerEmail}</p>
            <p><b>Phone:</b> {selectedOrder.phone}</p>
            <p><b>Address:</b> {selectedOrder.address}</p>

            <div className="divider"></div>

            <h4 className="font-semibold mb-2 md:mb-3">
              Ordered Items
            </h4>

            {selectedOrder.items?.map((item, i) => (

              <div
                key={i}
                className="flex items-center gap-3 border p-2 rounded mb-2"
              >

                <img
                  src={item.foodImage}
                  className="w-12 h-12 md:w-16 md:h-16 rounded object-cover"
                />

                <div className="flex-1">

                  <p className="font-semibold">
                    {item.foodName}
                  </p>

                  <p className="text-xs md:text-sm opacity-60">
                    Price: ৳{item.price}
                  </p>

                  <p className="text-xs md:text-sm opacity-60">
                    Quantity: {item.quantity}
                  </p>

                </div>

                <p className="font-bold text-sm md:text-base whitespace-nowrap">
                  ৳{(item.price || 0) * (item.quantity || 0)}
                </p>

              </div>

            ))}

            <div className="divider"></div>

            <p className="text-base md:text-lg font-bold">
              Total: ৳{selectedOrder.orderTotal}
            </p>

            <button
              onClick={() => setSelectedOrder(null)}
              className="btn btn-sm mt-4 w-full bg-primary text-secondary hover:bg-secondary hover:text-primary"
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>

  );
};


export default MyOrders;









// import { useQuery } from '@tanstack/react-query';
// import useAxiosSecure from '../../../hooks/useAxiosSecure';
// import useAuth from '../../../hooks/useAuth';
// import Swal from 'sweetalert2';
// import { useState } from 'react';
// import Forbidden from '../../../Components/Forbidden/Forbidden';

// const MyOrders = () => {

//   const { user, loading } = useAuth();
//   const axiosSecure = useAxiosSecure();
//   const [selectedOrder, setSelectedOrder] = useState(null);

//   const { data: orders = [], refetch, isLoading } = useQuery({
//     queryKey: ['orders', user?.email],
//     enabled: !!user && !loading,
//     queryFn: async () => {
//       const res = await axiosSecure.get(`/orders?email=${user.email}`);
//       // console.log("my-orders", res.data);
//       return res.data;
//     }
//   });


//   const { data: users = [], isLoading: usersLoading
//     // error 
//   } = useQuery({
//     queryKey: ['users', user?.email],
//     enabled: !!user && !loading,
//     queryFn: async () => {
//       const res = await axiosSecure.get(`/users?email=${user.email}`);
//       return res.data;
//     }
//   });

//   if (usersLoading) {
//     return <span className="loading loading-infinity loading-xl my-14"></span>;
//   }


//   const dbUser = users.find(
//     u => u.email === user?.email
//   );

//   // console.log("dbuders", dbUser)

//   if (!dbUser) {
//     return <Forbidden></Forbidden>
//   }

//   // Cancel order
//   const handleCancelOrder = async (id) => {

//     const confirm = await Swal.fire({
//       title: "Cancel Order?",
//       text: "You can cancel only pending orders",
//       icon: "warning",
//       showCancelButton: true
//     });

//     if (!confirm.isConfirmed) return;

//     await axiosSecure.patch(`/orders/${id}`, { status: 'cancelled' });

//     refetch();

//     Swal.fire("Cancelled!", "Your order has been cancelled", "success");
//   };

//   const statusColor = (status) => {
//     const s = status?.toLowerCase();

//     if (s === 'pending') return 'bg-yellow-400';
//     if (s === 'preparing') return 'bg-blue-500';
//     if (s === 'delivered') return 'bg-green-600';
//     if (s === 'cancelled') return 'bg-red-500';

//     return 'bg-gray-400';
//   };

//   const paymentStatusColor = (paymentStatus) => {

//     const s = paymentStatus?.toLowerCase();

//     if (s === 'paid') return 'bg-green-600';
//     if (s === 'unpaid') return 'bg-red-500';

//     return 'bg-gray-400';
//   };

//   const paymentBkash = async (order) => {
//     const orderId = order._id;
//     console.log("paymentbkash", order._id);
//     try {
//       const { data } = await axiosSecure.post(`/paymentBkash`, { orderId });
//       if (data.success) {
//         // window.location.replace(data.url)
//         if (data?.url) {
//           window.location.replace(data.url);
//         } else {
//           Swal.fire("Error", "Payment URL missing");
//         }
//       }
//     }
//     catch (error) {
//       console.log(error);
//     }
//   };

//   if (isLoading) {
//     return <span className="loading loading-infinity loading-xl my-14"></span>;
//   }

//   return (

//     <div className='w-full md:w-11/12 mx-auto px-3 md:px-0 py-8 md:py-14'>

//       <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
//         My Orders: {orders.length}
//       </h2>

//       <div className="overflow-x-auto rounded-lg border">

//         <table className="table table-sm md:table-md w-full">

//           <thead>

//             <tr className="text-xs md:text-sm text-center">
//               <th>No</th>
//               <th className="min-w-[180px]">Food</th>
//               <th className="whitespace-nowrap">Total</th>
//               <th>Status</th>
//               <th>Payment Status</th>
//               {/* <th>Payment</th> */}
//               <th className="hidden md:table-cell">Date</th>
//               <th>Action</th>
//             </tr>

//           </thead>

//           <tbody className="text-center">

//             {orders.map((order, index) => (

//               <tr key={order._id} className="text-xs md:text-sm">

//                 <td>{index + 1}</td>

//                 {/* FOOD */}
//                 <td className="min-w-[180px]">

//                   <div className="flex items-center gap-2 md:gap-3">

//                     <img
//                       src={order.items?.[0]?.foodImage}
//                       className="w-10 h-10 md:w-14 md:h-14 rounded object-cover"
//                     />

//                     <div>

//                       <p className="font-semibold">
//                         {order.items?.[0]?.foodName}
//                       </p>

//                       {order.items?.length > 1 && (

//                         <p className="text-[10px] md:text-xs opacity-60">
//                           +{order.items.length - 1} more items
//                         </p>

//                       )}

//                     </div>

//                   </div>

//                 </td>

//                 {/* TOTAL */}
//                 <td className="whitespace-nowrap font-semibold">
//                   ৳ {order.orderTotal}
//                 </td>

//                 {/* STATUS */}
//                 <td>

//                   <span
//                     className={`text-secondary text-xs md:text-sm p-2 rounded ${statusColor(order.status)}`}
//                   >
//                     {order.status}
//                   </span>

//                 </td>

//                 {/* PAYMENT */}
//                 {/* <td>

//                   <span
//                     className={`text-secondary text-xs md:text-sm p-2 rounded ${paymentStatusColor(order.paymentStatus)}`}
//                   >
//                     {order.paymentStatus}
//                   </span>

//                 </td> */}
//                 <td>

//                   {order.paymentStatus === 'unpaid' && <button onClick={() => paymentBkash(order)} className='bg-primary hover:bg-secondary hover:text-primary text-secondary p-2 rounded'>Pay Now</button>}
//                   {/* <button onClick={() => paymentBkash(order)} className='bg-primary text-secondary p-2'>Pay Now</button> */}
//                   {order.paymentStatus === 'paid' && <button className={`text-secondary text-xs md:text-sm p-2 rounded ${paymentStatusColor(order.paymentStatus)}`}>Paid</button>}

//                   {/* <span
//                   className={`text-white text-xs md:text-sm p-2  rounded ${paymentStatusColor(order.paymentStatus)}`}
//                 >
//                   {order.paymentStatus}
//                 </span> */}

//                 </td>

//                 {/* DATE (hidden mobile) */}
//                 <td className="hidden md:table-cell whitespace-nowrap">
//                   {new Date(order.createdAt).toLocaleDateString()}
//                 </td>

//                 {/* ACTION */}
//                 <td className="align-middle text-center">
//                   <div className="flex flex-col md:flex-row items-center justify-center gap-2">
//                     <button
//                       onClick={() => setSelectedOrder(order)}
//                       className="btn btn-xs md:btn-sm bg-primary text-secondary hover:bg-secondary hover:text-primary"
//                     >
//                       Details
//                     </button>

//                     {order.status?.toLowerCase() === 'pending' ? (
//                       <button
//                         onClick={() => handleCancelOrder(order._id)}
//                         className="btn btn-xs md:btn-sm bg-red-500 text-secondary hover:bg-red-600"
//                       >
//                         Cancel
//                       </button>
//                     ) : (
//                       <span className="bg-red-600 text-secondary p-2 rounded text-[10px] md:text-xs">
//                         Not Allowed
//                       </span>
//                     )}
//                   </div>
//                 </td>

//               </tr>

//             ))}

//           </tbody>

//         </table>

//       </div>

//       {/* MODAL */}

//       {selectedOrder && (

//         <div className="fixed inset-0 bg-black/40 flex justify-center items-center px-3">

//           <div className="bg-base-200 p-4 md:p-6 rounded w-full max-w-lg max-h-[85vh] overflow-y-auto">

//             <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">
//               Order Details
//             </h3>

//             <p><b>Name:</b> {selectedOrder.customerName}</p>
//             <p><b>Email:</b> {selectedOrder.customerEmail}</p>
//             <p><b>Phone:</b> {selectedOrder.phone}</p>
//             <p><b>Address:</b> {selectedOrder.address}</p>

//             <div className="divider"></div>

//             <h4 className="font-semibold mb-2 md:mb-3">
//               Ordered Items
//             </h4>

//             {selectedOrder.items?.map((item, i) => (

//               <div
//                 key={i}
//                 className="flex items-center gap-3 border p-2 rounded mb-2"
//               >

//                 <img
//                   src={item.foodImage}
//                   className="w-12 h-12 md:w-16 md:h-16 rounded object-cover"
//                 />

//                 <div className="flex-1">

//                   <p className="font-semibold">
//                     {item.foodName}
//                   </p>

//                   <p className="text-xs md:text-sm opacity-60">
//                     Price: ৳{item.price}
//                   </p>

//                   <p className="text-xs md:text-sm opacity-60">
//                     Quantity: {item.quantity}
//                   </p>

//                 </div>

//                 <p className="font-bold text-sm md:text-base whitespace-nowrap">
//                   ৳{(item.price || 0) * (item.quantity || 0)}
//                 </p>

//               </div>

//             ))}

//             <div className="divider"></div>

//             <p className="text-base md:text-lg font-bold">
//               Total: ৳{selectedOrder.orderTotal}
//             </p>

//             <button
//               onClick={() => setSelectedOrder(null)}
//               className="btn btn-sm mt-4 w-full bg-primary text-secondary hover:bg-secondary hover:text-primary"
//             >
//               Close
//             </button>

//           </div>

//         </div>

//       )}

//     </div>

//   );
// };

// export default MyOrders;