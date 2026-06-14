import { useState } from "react"
import Swal from "sweetalert2"
// import axios from "axios"
import useAuth from "../../../hooks/useAuth"
import useAxiosSecure from "../../../hooks/useAxiosSecure"
import { useQuery } from "@tanstack/react-query"
// import { AuthContext } from "../../providers/AuthProvider"

const Checkout = () => {

  //   const { user } = useContext(AuthContext)
  const axiosSecure = useAxiosSecure()
  const { user } = useAuth()

  const { data: cartItems = [] } = useQuery({
    queryKey: ["cart", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/cart?email=${user.email}`);
      return res.data;
    }
  });

  // console.log('cartItems', cartItems)


  const [formData, setFormData] = useState({
    name: user?.displayName || "",
    phone: "",
    address: "",
    transactionID: ""
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }



  // const handleOrder = async (e) => {
  //     e.preventDefault()

  //     const items = cartItems.map(item => ({
  //         foodId: item.foodId,
  //         foodName: item.name,
  //         foodImage: item.image,
  //         price: item.price,
  //         quantity: item.quantity,
  //         totalPrice: item.price * item.quantity
  //     }))

  //     const orderTotal = items.reduce((sum, item) => sum + item.totalPrice, 0)

  //     const orderData = {

  //         customerName: formData.name,
  //         customerEmail: user.email,
  //         phone: formData.phone,
  //         address: formData.address,

  //         items: items,
  //         orderTotal: orderTotal,

  //         status: "pending",
  //         paymentStatus: "unpaid",
  //         createdAt: new Date()

  //     }

  //     const res = await axiosSecure.post("/orders", orderData)
  //     console.log('checkout', res)

  // }

  const handleOrder = async (e) => {
    e.preventDefault()

    const items = cartItems.map(item => ({
      foodId: item.foodId,
      foodName: item.name,
      foodImage: item.image,
      price: item.price,
      quantity: item.quantity,
      totalPrice: item.price * item.quantity
    }))

    const orderTotal = items.reduce((sum, item) => sum + item.totalPrice, 0)

    const orderData = {

      customerName: formData.name,
      customerEmail: user.email,
      phone: formData.phone,
      address: formData.address,
      transactionID: formData.transactionID,

      items: items,
      orderTotal: orderTotal + 100,

      status: "pending",
      paymentStatus: "unpaid",
      createdAt: new Date()

    }

    try {

      const res = await axiosSecure.post("/orders", orderData)

      if (res.data.insertedId) {

        // 🧹 Cart Empty
        await axiosSecure.delete(`/cart/user/${user.email}`)

        Swal.fire({
          icon: "success",
          title: "Order Confirmed 🎉"
        })

      }

    } catch (error) {
      console.log(error)
    }

  }

  return (

    <div className="w-full max-w-5xl mx-auto my-10 p-3 md:px-6">

      <h2 className="text-3xl font-bold mb-6">Checkout</h2>

      <form onSubmit={handleOrder} className="space-y-4">

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your Name"
          className="w-full border p-3 rounded"
          required
        />
        <input
          type="text"
          name="transactionID"
          value={formData.transactionID}
          onChange={handleChange}
          placeholder="Transaction Id"
          className="w-full border p-3 rounded"
          required
        />
        <input
          type="text"
          name="phone"
          onChange={handleChange}
          placeholder="Phone Number"
          className="w-full border p-3 rounded"
          required
        />

        <textarea
          name="address"
          onChange={handleChange}
          placeholder="Delivery Address"
          className="w-full border p-3 rounded"
          required
        />

        <button
          type="submit"
          className="bg-primary text-secondary hover:bg-secondary hover:text-primary w-full py-3 rounded-lg"
        >
          Confirm Order
        </button>

      </form>

    </div>
  )
}

export default Checkout