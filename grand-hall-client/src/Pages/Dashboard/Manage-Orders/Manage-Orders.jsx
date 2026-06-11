import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useState } from 'react';
import Swal from "sweetalert2";
import useAuth from '../../../hooks/useAuth';

const ManageOrders = () => {

  const axiosSecure = useAxiosSecure();
  const { user, loading } = useAuth();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // const { data: orders = [], refetch } = useQuery({
  //   queryKey: ['orders'],
  //   queryFn: async () => {
  //     const res = await axiosSecure.get('/orders');
  //     console.log("manage orders: ", res.data)
  //     return res.data;
  //   }
  // });

  const { data: orders = [], refetch } = useQuery({
      queryKey: ['orders', user?.email],
      enabled: !!user && !loading,
      queryFn: async () => {
        const res = await axiosSecure.get(`/orders?email=${user.email}`);
        // console.log("manage-orders", res.data);
        return res.data;
      }
    });

  // ⭐ Order Status Update
  const handleOrderStatus = async (id, newStatus) => {

    const confirm = await Swal.fire({
      title: "Update Order Status?",
      text: `Change status to "${newStatus}"`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Update"
    });

    if (!confirm.isConfirmed) return;

    await axiosSecure.patch(`/orders/${id}`, {
      status: newStatus
    });

    refetch();

    Swal.fire("Updated!", "Order status updated", "success");
  };

  // ⭐ Payment Status Update
  const handlePaymentStatus = async (id, newStatus) => {

    const confirm = await Swal.fire({
      title: "Update Payment Status?",
      text: `Mark payment as "${newStatus}"`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Update"
    });

    if (!confirm.isConfirmed) return;

    await axiosSecure.patch(`/orders/${id}`, {
      paymentStatus: newStatus
    });

    refetch();

    Swal.fire("Updated!", "Payment status updated", "success");
  };

  // ⭐ Filter Logic
  const filteredOrders = orders.filter(order => {

    const foodMatch = order.items?.some(item =>
      item.foodName?.toLowerCase().includes(search.toLowerCase())
    );

    const customerMatch =
      order.customerName?.toLowerCase().includes(search.toLowerCase());

    const matchSearch = foodMatch || customerMatch;

    const matchStatus =
      statusFilter === 'all' || order.status === statusFilter;

    const matchPayment =
      paymentFilter === 'all' || order.paymentStatus === paymentFilter;

    return matchSearch && matchStatus && matchPayment;
  });

  // ⭐ Revenue
  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + (o.orderTotal || 0), 0);
    // .reduce((sum, o) => sum + o.orderTotal, 0);

  return (

  <div className='w-full md:w-11/12 mx-auto px-3 sm:px-4 md:px-0 py-6 md:py-12'>

    {/* HEADER */}

    <h2 className="text-2xl sm:text-3xl font-bold mb-2 md:mb-3">
      Manage Orders ({filteredOrders.length})
    </h2>

    <p className="font-semibold text-green-600 mb-4 md:mb-6 text-sm sm:text-base">
      Total Revenue: ৳{totalRevenue}
    </p>

    {/* FILTERS */}

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">

      <input
        type="text"
        placeholder="Search food / customer..."
        className="input input-bordered w-full"
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        className="select select-bordered w-full"
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="all">All Status</option>
        <option value="pending">Pending</option>
        <option value="preparing">Preparing</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
      </select>

      <select
        className="select select-bordered w-full"
        onChange={(e) => setPaymentFilter(e.target.value)}
      >
        <option value="all">All Payment</option>
        <option value="paid">Paid</option>
        <option value="unpaid">Unpaid</option>
      </select>

    </div>

    {/* TABLE */}

    <div className="overflow-x-auto rounded-lg border">

      <table className="table table-sm md:table-md">

        <thead>

          <tr className="text-xs sm:text-sm">
            <th>No</th>
            <th className="min-w-[180px]">Food</th>
            <th className="hidden md:table-cell">Customer</th>
            <th className="min-w-[90px]">Total</th>
            <th className="hidden lg:table-cell">Transaction</th>
            <th>Status</th>
            <th>Payment</th>
            <th>Action</th>
          </tr>

        </thead>

        <tbody>

          {filteredOrders.map((order, i) => (

            <tr key={order._id} className="text-xs sm:text-sm">

              <td>{i + 1}</td>

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
                      <p className="text-[10px] sm:text-xs opacity-60">
                        +{order.items.length - 1} more items
                      </p>
                    )}

                  </div>

                </div>

              </td>

              {/* CUSTOMER */}

              <td className="hidden md:table-cell">

                <p className="font-semibold">
                  {order.customerName}
                </p>

                <p className="text-xs opacity-60">
                  {order.customerEmail}
                </p>

              </td>

              {/* TOTAL FIXED */}

              <td className="whitespace-nowrap px-2 md:px-4 font-semibold min-w-[90px]">

                <div className="flex flex-col">

                  {/* <span className="md:hidden text-[10px] opacity-60">
                    Total
                  </span> */}

                  <span>
                    ৳{order.orderTotal}
                  </span>

                </div>

              </td>

              {/* TRANSACTION */}

              <td className="hidden lg:table-cell">
                {order.transactionID}
              </td>

              {/* STATUS */}

              <td>

                <select
                  className="select select-xs md:select-sm"
                  value={order.status}
                  onChange={(e) =>
                    handleOrderStatus(order._id, e.target.value)
                  }
                >

                  <option value="pending">Pending</option>
                  <option value="preparing">Preparing</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>

                </select>

              </td>

              {/* PAYMENT */}

              <td>

                <select
                  className="select select-xs md:select-sm"
                  value={order.paymentStatus}
                  onChange={(e) =>
                    handlePaymentStatus(order._id, e.target.value)
                  }
                >

                  <option value="unpaid">Unpaid</option>
                  <option value="paid">Paid</option>

                </select>

              </td>

              {/* DETAILS */}

              <td>

                <button
                  onClick={() => setSelectedOrder(order)}
                  className="btn btn-xs md:btn-sm bg-primary text-secondary hover:bg-secondary hover:text-primary"
                >
                  Details
                </button>

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

          <p><b>Customer:</b> {selectedOrder.customerName}</p>
          <p><b>Email:</b> {selectedOrder.customerEmail}</p>
          <p><b>Phone:</b> {selectedOrder.phone}</p>
          <p><b>Address:</b> {selectedOrder.address}</p>
          <p><b>Transaction ID:</b> {selectedOrder.transactionID}</p>
          <p><b>Payment Status:</b> {selectedOrder.paymentStatus}</p>

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

              <p className="font-bold text-sm md:text-base">
                ৳{item.price * item.quantity}
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

export default ManageOrders;