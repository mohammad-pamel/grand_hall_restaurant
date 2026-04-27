// const express = require('express');
// const router = express.Router();
// const axios = require('axios');
// const { ObjectId } = require('mongodb');

// let ordersCollection;

// // Setter for collection
// function setCollections({ ordersCollection: oc }) {
//     ordersCollection = oc;
// }

// // Bkash sandbox credentials
// const bkashConfig = {
//     username: process.env.BKASH_USERNAME,
//     password: process.env.BKASH_PASSWORD,
//     appKey: process.env.BKASH_APP_KEY,
//     appSecret: process.env.BKASH_APP_SECRET,
//     baseURL: 'https://tokenized.sandbox.bka.sh/v1.2.0-beta'
// };

// // 1️⃣ Generate Token
// let bkashToken = null;
// async function generateBkashToken() {
//     const res = await axios.post(`${bkashConfig.baseURL}/checkout/token/grant`, {
//         app_key: bkashConfig.appKey,
//         app_secret: bkashConfig.appSecret
//     }, {
//         headers: {
//             username: bkashConfig.username,
//             password: bkashConfig.password
//         }
//     });
//     bkashToken = res.data.id_token;
// }
// generateBkashToken();

// // 2️⃣ Create Payment
// router.post('/create-payment', async (req, res) => {
//     const { orderId, amount } = req.body;

//     try {
//         const response = await axios.post(
//             `${bkashConfig.baseURL}/checkout/payment/create`,
//             {
//                 amount: amount.toString(),
//                 intent: 'sale',
//                 currency: 'BDT',
//                 merchantInvoiceNumber: orderId
//             },
//             {
//                 headers: {
//                     Authorization: `Bearer ${bkashToken}`,
//                     'X-APP-Key': bkashConfig.appKey,
//                     'Content-Type': 'application/json'
//                 }
//             }
//         );

//         res.send(response.data); // paymentID
//     } catch (err) {
//         console.log(err.response?.data || err);
//         res.status(500).send({ message: 'Bkash payment create failed' });
//     }
// });

// // 3️⃣ Execute Payment
// router.post('/execute-payment', async (req, res) => {
//     const { paymentID, orderId } = req.body;

//     try {
//         const response = await axios.post(
//             `${bkashConfig.baseURL}/checkout/payment/execute/${paymentID}`,
//             {},
//             {
//                 headers: {
//                     Authorization: `Bearer ${bkashToken}`,
//                     'X-APP-Key': bkashConfig.appKey,
//                     'Content-Type': 'application/json'
//                 }
//             }
//         );

//         // ✅ Payment success -> update order
//         if (response.data.transactionStatus === 'Completed') {
//             await ordersCollection.updateOne(
//                 { _id: new ObjectId(orderId) },
//                 { $set: { status: 'completed', paymentStatus: 'paid' } }
//             );
//         }

//         res.send(response.data);
//     } catch (err) {
//         console.log(err.response?.data || err);
//         res.status(500).send({ message: 'Bkash payment execute failed' });
//     }
// });

// module.exports = router;
// module.exports.setCollections = setCollections;
