import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import jwt from 'jsonwebtoken';

import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';

const app = express();
import SSLCommerzPayment from 'sslcommerz-lts';
const port = process.env.PORT || 5000;

// import admin from "firebase-admin";

// // import serviceAccount from "./grand-hall-firebase-adminsdk.json";
// import serviceAccount from './grand-hall-firebase-adminsdk.json' with { type: 'json' };

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

const store_id = process.env.STORE_ID
const store_passwd = process.env.STORE_PASS
const is_live = false //true for live, false for sandbox


const verifyJwtToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // console.log("HEADERS:", req.headers.authorization);


  if (!authHeader) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    // req.decoded = decoded;

    req.token_email = decoded.email;
    next();
  });
};

const verifyAdmin = async (req, res, next) => {
  const email = req.token_email;
  // console.log("email verifyadmin", email);

  const user =
    await usersCollection.findOne({
      email
    });

  if (!user || user.role !== "admin") {

    return res.status(403).send({
      message: "Forbidden"
    });

  }

  next();
};


// const decoded = Buffer.from(process.env.FB_SERVICE_KEY, "base64").toString("utf8");
// const serviceAccount = JSON.parse(decoded);


// middleware
app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost:5173',
    // 'http://localhost:5174',
    'https://grand-hall.web.app'
  ],
  credentials: true
}));



// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zyhkinn.mongodb.net/?appName=Cluster0`

const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ac-wqk9jwc-shard-00-00.zyhkinn.mongodb.net:27017,ac-wqk9jwc-shard-00-01.zyhkinn.mongodb.net:27017,ac-wqk9jwc-shard-00-02.zyhkinn.mongodb.net:27017/?ssl=true&replicaSet=atlas-9ilhfu-shard-0&authSource=admin&appName=Cluster0`

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


let foodsCollection;
let ordersCollection;
let usersCollection;
let cartCollection;


async function startServer() {
  try {
    // 🔥 FIRST connect DB
    await client.connect();
    const db = client.db('grand_hall_db');
    usersCollection = db.collection('users');
    foodsCollection = db.collection('menu');
    cartCollection = db.collection('cart');
    ordersCollection = db.collection('orders');



    console.log('✅ MongoDB connected');

    // ===== ROUTES =====

    app.get('/', (req, res) => {
      res.send('Grand Hall Server Running 🚀');
    });

    app.post('/jwt', async (req, res) => {

      const { email, uid } = req.body;

      const user = await usersCollection.findOne({
        email
      });

      const token = jwt.sign(
        {
          uid,
          email,
          role: user?.role || "user"
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '7d'
        }
      );

      res.send({ token });

    });


    app.get('/users', verifyJwtToken, async (req, res) => {
      try {
        const email = req.query.email
        const tokenEmail = req.token_email;

        // console.log("headerssssss", req.headers);
        // console.log("email", email);
        // console.log("Tokenemail", tokenEmail);

        if (email !== tokenEmail) {
          return res.status(403).send({
            message: 'Forbidden access'
          });
        }

        const user = await usersCollection.findOne({
          email: tokenEmail
        });

        if (!user) {
          return res.status(403).send({
            message: 'Forbidden access'
          });
        }

        if (user.role === 'admin') {
          const result = await usersCollection
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

          return res.send(result);
        }

        return res.send([user]);

      } catch (error) {
        console.log(error);

        return res.status(500).send({
          message: 'Server Error'
        });
      }
    });

    app.get('/users/:email/role', verifyJwtToken, async (req, res) => {
      const email = req.params.email;

      const user = await usersCollection.findOne({ email });

      res.send({ role: user?.role || 'user' });
    });

    app.get('/users/:id', verifyJwtToken, async (req, res) => {
      const id = req.params.id;
      const email = req.token_email;

      const user = await usersCollection.findOne({ email });

      if (!user) {
        return res.status(403).send({ message: 'Forbidden access' });
      }

      if (user?.email === email) {

        const result = await usersCollection.findOne({ _id: new ObjectId(id) });

        return res.send(result);
      }
    })


    app.post('/users', async (req, res) => {
      const user = req.body;
      user.role = 'user';
      user.createdAt = new Date();
      const email = user.email;
      const userExists = await usersCollection.findOne({ email });

      if (userExists) {
        return res.send({ message: 'user exists' });
      }

      const result = await usersCollection.insertOne(user);
      res.send(result);
    })



    app.patch('/users/:id', verifyJwtToken, verifyAdmin, async (req, res) => {
      const id = req.params.id;
      const roleInfo = req.body;
      const query = { _id: new ObjectId(id) }

      const updatedDoc = {
        $set: {
          role: roleInfo.role
        }
      };

      const result = await usersCollection.updateOne(query, updatedDoc);
      res.send(result);
    });

    app.patch('/users/:email', verifyJwtToken, async (req, res) => {

      const email = req.params.email;

      // Security Check
      if (!email) {
        return res.status(403).send({
          message: 'forbidden access'
        });
      }

      const { displayName, photoURL } = req.body;

      const filter = { email };

      const updateDoc = {
        $set: {
          displayName,
          photoURL
        }
      };

      const result = await usersCollection.updateOne(
        filter,
        updateDoc
      );

      res.send(result);
    });


    // food api
    app.get('/menu', async (req, res) => {
      const result = await foodsCollection.find().toArray();
      res.send(result);
    });

    app.get('/latest-foods', async (req, res) => {
      const cursor = foodsCollection.find().sort({ createdAt: -1 }).limit(6);
      const result = await cursor.toArray();
      res.send(result);
    })

    // get single food
    app.get('/menu/:id', async (req, res) => {
      try {
        const id = req.params.id;

        const result = await foodsCollection.findOne({
          _id: new ObjectId(id)
        });

        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to get food" });
      }
    });


    app.post('/menu', verifyJwtToken, verifyAdmin, async (req, res) => {
      try {
        const food = req.body;
        const result = await foodsCollection.insertOne(food);
        res.send(result);
      } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Insert failed' });
      }
    });


    app.patch('/menu/:id', verifyJwtToken, verifyAdmin, async (req, res) => {
      const id = req.params.id;
      const updatedFood = req.body;

      const result = await foodsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedFood }
      );

      res.send(result);
    });


    app.delete('/menu/:id', verifyJwtToken, verifyAdmin, async (req, res) => {
      const id = req.params.id;
      const result = await foodsCollection.deleteOne({
        _id: new ObjectId(id)
      });
      res.send(result);
    });


    //////////////// CART////////////////////////////////////

    app.get("/cart", verifyJwtToken, async (req, res) => {

      const email = req.query.email

      if (email !== req.token_email) {
        return res.status(403).send({
          message: "Forbidden"
        });
      }

      const result = await cartCollection
        .find({ email })
        .toArray()

      res.send(result)

    })

    app.post("/cart", verifyJwtToken, async (req, res) => {

      const cartItem = req.body

      const query = {
        foodId: cartItem.foodId,
        email: cartItem.email
      }

      const existing = await cartCollection.findOne(query)

      if (existing) {
        return res.send({ message: "already added" })
      }

      const result = await cartCollection.insertOne(cartItem)

      res.send(result)

    })

    app.patch("/cart/increase/:id", verifyJwtToken, async (req, res) => {

      const id = req.params.id;

      const result = await cartCollection.updateOne(
        { _id: new ObjectId(id) },
        { $inc: { quantity: 1 } }
      );

      res.send(result);
    });

    app.patch("/cart/decrease/:id", verifyJwtToken, async (req, res) => {

      const id = req.params.id;

      const item = await cartCollection.findOne({
        _id: new ObjectId(id)
      });

      if (item.quantity <= 1) {
        return res.send({
          message: 'Minimum quantity reached'
        });
      }

      const result = await cartCollection.updateOne(
        { _id: new ObjectId(id) },
        { $inc: { quantity: -1 } }
      );

      res.send(result);
    });

    app.delete("/cart/:id", verifyJwtToken, async (req, res) => {

      const id = req.params.id;

      const result = await cartCollection.deleteOne({
        _id: new ObjectId(id)
      });

      res.send(result);

    });


    app.delete("/cart/user/:email", verifyJwtToken, async (req, res) => {

      const email = req.params.email

      const result = await cartCollection.deleteMany({ email })

      res.send(result)

    })


    // app.get('/orders', verifyToken, async (req, res) => {

    app.get('/orders', verifyJwtToken, async (req, res) => {
      try {
        const email = req.query.email;
        const tokenEmail = req.token_email;

        const user = await usersCollection.findOne({ email: tokenEmail });

        if (!user) {
          return res.status(403).send({ message: 'Forbidden access' });
        }


        // 🔥 admin → all orders
        if (user?.role === 'admin') {
          const result = await ordersCollection
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

          return res.send(result);
        }

        // 🔥 user → own orders only
        if (!email) {
          return res.status(403).send({ message: 'Forbidden access' });
        }

        if (user?.role === 'user') {
          const result = await ordersCollection
            .find({ customerEmail: tokenEmail })
            .sort({ createdAt: -1 })
            .toArray();

          return res.send(result);
        }
        else {
          return res.status(403).send({ message: 'Forbidden access' });
        }

      } catch (error) {
        res.status(500).send({ message: 'Failed to fetch orders' });
      }
    });


    // create order

    app.post('/orders', verifyJwtToken, async (req, res) => {
      try {

        const order = req.body;

        const newOrder = {
          ...order,

          status: 'pending',            // ⭐ single status field
          paymentStatus: 'unpaid',      // ⭐ payment default

          createdAt: new Date()
        };

        const result = await ordersCollection.insertOne(newOrder);

        res.send(result);

      } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Order creation failed' });
      }
    });


    app.patch('/orders/:id', verifyJwtToken, async (req, res) => {
      try {

        const id = req.params.id;
        const updateData = req.body;

        const result = await ordersCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updateData }
        );

        res.send(result);

      } catch (error) {
        res.status(500).send({ message: 'Order update failed' });
      }
    });


    app.post('/paymentBkash', async (req, res) => {
      const { orderId } = req.body;

      try {
        // const orederData = await oredersCollection.findOne(orderId);
        const orderData = await ordersCollection.findOne({ _id: new ObjectId(orderId) });
        const tran_id = orderId
        // console.log(typeof orderData.orderTotal);
        // console.log(orderData.orderTotal);
        const data = {
          total_amount: orderData.orderTotal,
          currency: 'BDT',
          tran_id: tran_id, // use unique tran_id for each api call
          success_url: `http://localhost:5000/payment/success/${tran_id}`,
          fail_url: `http://localhost:5000/payment/fail/${tran_id}`,
          cancel_url: `http://localhost:5000/payment/cancel/${tran_id}`,
          ipn_url: 'http://localhost:5173/ipn',
          shipping_method: 'Courier',
          product_name: 'Computer.',
          product_category: 'Electronic',
          product_profile: 'general',
          cus_name: 'Customer Name',
          cus_email: 'customer@example.com',
          cus_add1: 'Dhaka',
          cus_add2: 'Dhaka',
          cus_city: 'Dhaka',
          cus_state: 'Dhaka',
          cus_postcode: '1000',
          cus_country: 'Bangladesh',
          cus_phone: '01711111111',
          cus_fax: '01711111111',
          ship_name: 'Customer Name',
          ship_add1: 'Dhaka',
          ship_add2: 'Dhaka',
          ship_city: 'Dhaka',
          ship_state: 'Dhaka',
          ship_postcode: 1000,
          ship_country: 'Bangladesh',
        };

        const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)

        sslcz.init(data).then(apiResponse => {

          if (!apiResponse.GatewayPageURL) {
            return res.status(400).send({
              success: false,
              sslResponse: apiResponse
            });
          }

          res.send({
            success: true,
            url: apiResponse.GatewayPageURL
          });

        });
      }
      catch (error) {
        console.log(error);

        return res.status(500).send({
          success: false,
          message: error.message
        });
      }
    })



    app.post('/payment/success/:id', async (req, res) => {
      const { id } = req.params;
      console.log(id)
      try {
        await ordersCollection.updateOne(
          { _id: new ObjectId(id) },
          {
            $set: {
              paymentStatus: 'paid'
            }
          }
        );
        res.redirect(`http://localhost:5173/paymentSuccess/${id}`)
      }
      catch (error) {
        console.log(error)
      }
    })

    app.post('/payment/fail/:id', async (req, res) => {
      res.redirect(`http://localhost:5173/payment/fail`);
    });

    app.post('/payment/cancel/:id', async (req, res) => {
      res.redirect(`http://localhost:5173/my-orders`);
    });





    // 🔥 THEN start server
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });

  } catch (error) {
    console.error('❌ Failed to start server', error);
  }
}

startServer();







// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';

// dotenv.config();

// import jwt from 'jsonwebtoken';

// import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';

// const app = express();
// import SSLCommerzPayment from 'sslcommerz-lts';
// const port = process.env.PORT || 5000;

// // import admin from "firebase-admin";

// // // import serviceAccount from "./grand-hall-firebase-adminsdk.json";
// // import serviceAccount from './grand-hall-firebase-adminsdk.json' with { type: 'json' };

// // admin.initializeApp({
// //   credential: admin.credential.cert(serviceAccount)
// // });

// const store_id = process.env.STORE_ID
// const store_passwd = process.env.STORE_PASS
// const is_live = false //true for live, false for sandbox


// const verifyJwtToken = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   // console.log("HEADERS:", req.headers.authorization);


//   if (!authHeader) {
//     return res.status(401).send({ message: "Unauthorized" });
//   }

//   const token = authHeader.split(" ")[1];

//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) {
//       return res.status(401).send({ message: "Unauthorized" });
//     }

//     // req.decoded = decoded;

//     req.token_email = decoded.email;
//     next();
//   });
// };

// const verifyAdmin = async (req, res, next) => {
//   const email = req.token_email;
//   // console.log("email verifyadmin", email);

//   const user =
//     await usersCollection.findOne({
//       email
//     });

//   if (!user || user.role !== "admin") {

//     return res.status(403).send({
//       message: "Forbidden"
//     });

//   }

//   next();
// };


// // const decoded = Buffer.from(process.env.FB_SERVICE_KEY, "base64").toString("utf8");
// // const serviceAccount = JSON.parse(decoded);


// // middleware
// app.use(express.json());
// app.use(cors({
//   origin: [
//     'http://localhost:5173',
//     // 'http://localhost:5174',
//     'https://grand-hall.web.app'
//   ],
//   credentials: true
// }));



// // const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zyhkinn.mongodb.net/?appName=Cluster0`

// const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ac-wqk9jwc-shard-00-00.zyhkinn.mongodb.net:27017,ac-wqk9jwc-shard-00-01.zyhkinn.mongodb.net:27017,ac-wqk9jwc-shard-00-02.zyhkinn.mongodb.net:27017/?ssl=true&replicaSet=atlas-9ilhfu-shard-0&authSource=admin&appName=Cluster0`

// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });


// let foodsCollection;
// let ordersCollection;
// let usersCollection;
// let cartCollection;


// async function startServer() {
//   try {
//     // 🔥 FIRST connect DB
//     await client.connect();
//     const db = client.db('grand_hall_db');
//     usersCollection = db.collection('users');
//     foodsCollection = db.collection('menu');
//     cartCollection = db.collection('cart');
//     ordersCollection = db.collection('orders');



//     console.log('✅ MongoDB connected');

//     // ===== ROUTES =====

//     app.get('/', (req, res) => {
//       res.send('Grand Hall Server Running 🚀');
//     });

//     app.post('/jwt', async (req, res) => {

//       const { email, uid } = req.body;

//       const user = await usersCollection.findOne({
//         email
//       });

//       const token = jwt.sign(
//         {
//           uid,
//           email,
//           role: user?.role || "user"
//         },
//         process.env.JWT_SECRET,
//         {
//           expiresIn: '7d'
//         }
//       );

//       res.send({ token });

//     });


//     app.get('/users', verifyJwtToken, async (req, res) => {
//       try {
//         const email = req.query.email
//         const tokenEmail = req.token_email;

//         // console.log("headerssssss", req.headers);
//         // console.log("email", email);
//         // console.log("Tokenemail", tokenEmail);

//         if (email !== tokenEmail) {
//           return res.status(403).send({
//             message: 'Forbidden access'
//           });
//         }

//         const user = await usersCollection.findOne({
//           email: tokenEmail
//         });

//         if (!user) {
//           return res.status(403).send({
//             message: 'Forbidden access'
//           });
//         }

//         if (user.role === 'admin') {
//           const result = await usersCollection
//             .find({})
//             .sort({ createdAt: -1 })
//             .toArray();

//           return res.send(result);
//         }

//         return res.send([user]);

//       } catch (error) {
//         console.log(error);

//         return res.status(500).send({
//           message: 'Server Error'
//         });
//       }
//     });

//     app.get('/users/:email/role', verifyJwtToken, async (req, res) => {
//       const email = req.params.email;

//       const user = await usersCollection.findOne({ email });

//       res.send({ role: user?.role || 'user' });
//     });

//     app.get('/users/:id', verifyJwtToken, async (req, res) => {
//       const id = req.params.id;
//       const email = req.token_email;

//       const user = await usersCollection.findOne({ email });

//       if (!user) {
//         return res.status(403).send({ message: 'Forbidden access' });
//       }

//       if (user?.email === email) {

//         const result = await usersCollection.findOne({ _id: new ObjectId(id) });

//         return res.send(result);
//       }
//     })


//     app.post('/users', async (req, res) => {
//       const user = req.body;
//       user.role = 'user';
//       user.createdAt = new Date();
//       const email = user.email;
//       const userExists = await usersCollection.findOne({ email });

//       if (userExists) {
//         return res.send({ message: 'user exists' });
//       }

//       const result = await usersCollection.insertOne(user);
//       res.send(result);
//     })



//     app.patch('/users/:id', verifyJwtToken, verifyAdmin, async (req, res) => {
//       const id = req.params.id;
//       const roleInfo = req.body;
//       const query = { _id: new ObjectId(id) }

//       const updatedDoc = {
//         $set: {
//           role: roleInfo.role
//         }
//       };

//       const result = await usersCollection.updateOne(query, updatedDoc);
//       res.send(result);
//     });

//     app.patch('/users/:email', verifyJwtToken, async (req, res) => {

//       const email = req.params.email;

//       // Security Check
//       if (!email) {
//         return res.status(403).send({
//           message: 'forbidden access'
//         });
//       }

//       const { displayName, photoURL } = req.body;

//       const filter = { email };

//       const updateDoc = {
//         $set: {
//           displayName,
//           photoURL
//         }
//       };

//       const result = await usersCollection.updateOne(
//         filter,
//         updateDoc
//       );

//       res.send(result);
//     });


//     // food api
//     app.get('/menu', async (req, res) => {
//       const result = await foodsCollection.find().toArray();
//       res.send(result);
//     });

//     app.get('/latest-foods', async (req, res) => {
//       const cursor = foodsCollection.find().sort({ createdAt: -1 }).limit(6);
//       const result = await cursor.toArray();
//       res.send(result);
//     })

//     // get single food
//     app.get('/menu/:id', async (req, res) => {
//       try {
//         const id = req.params.id;

//         const result = await foodsCollection.findOne({
//           _id: new ObjectId(id)
//         });

//         res.send(result);
//       } catch (error) {
//         console.error(error);
//         res.status(500).send({ message: "Failed to get food" });
//       }
//     });


//     app.post('/menu', verifyJwtToken, verifyAdmin, async (req, res) => {
//       try {
//         const food = req.body;
//         const result = await foodsCollection.insertOne(food);
//         res.send(result);
//       } catch (err) {
//         console.error(err);
//         res.status(500).send({ message: 'Insert failed' });
//       }
//     });


//     app.patch('/menu/:id', verifyJwtToken, verifyAdmin, async (req, res) => {
//       const id = req.params.id;
//       const updatedFood = req.body;

//       const result = await foodsCollection.updateOne(
//         { _id: new ObjectId(id) },
//         { $set: updatedFood }
//       );

//       res.send(result);
//     });


//     app.delete('/menu/:id', verifyJwtToken, verifyAdmin, async (req, res) => {
//       const id = req.params.id;
//       const result = await foodsCollection.deleteOne({
//         _id: new ObjectId(id)
//       });
//       res.send(result);
//     });


//     //////////////// CART////////////////////////////////////

//     app.get("/cart", verifyJwtToken, async (req, res) => {

//       const email = req.query.email

//       if (email !== req.token_email) {
//         return res.status(403).send({
//           message: "Forbidden"
//         });
//       }

//       const result = await cartCollection
//         .find({ email })
//         .toArray()

//       res.send(result)

//     })

//     app.post("/cart", verifyJwtToken, async (req, res) => {

//       const cartItem = req.body

//       const query = {
//         foodId: cartItem.foodId,
//         email: cartItem.email
//       }

//       const existing = await cartCollection.findOne(query)

//       if (existing) {
//         return res.send({ message: "already added" })
//       }

//       const result = await cartCollection.insertOne(cartItem)

//       res.send(result)

//     })

//     app.patch("/cart/increase/:id", verifyJwtToken, async (req, res) => {

//       const id = req.params.id;

//       const result = await cartCollection.updateOne(
//         { _id: new ObjectId(id) },
//         { $inc: { quantity: 1 } }
//       );

//       res.send(result);
//     });

//     app.patch("/cart/decrease/:id", verifyJwtToken, async (req, res) => {

//       const id = req.params.id;

//       const item = await cartCollection.findOne({
//         _id: new ObjectId(id)
//       });

//       if (item.quantity <= 1) {
//         return res.send({
//           message: 'Minimum quantity reached'
//         });
//       }

//       const result = await cartCollection.updateOne(
//         { _id: new ObjectId(id) },
//         { $inc: { quantity: -1 } }
//       );

//       res.send(result);
//     });

//     app.delete("/cart/:id", verifyJwtToken, async (req, res) => {

//       const id = req.params.id;

//       const result = await cartCollection.deleteOne({
//         _id: new ObjectId(id)
//       });

//       res.send(result);

//     });


//     app.delete("/cart/user/:email", verifyJwtToken, async (req, res) => {

//       const email = req.params.email

//       const result = await cartCollection.deleteMany({ email })

//       res.send(result)

//     })


//     // app.get('/orders', verifyToken, async (req, res) => {

//     app.get('/orders', verifyJwtToken, async (req, res) => {
//       try {
//         const email = req.query.email;
//         const tokenEmail = req.token_email;

//         const user = await usersCollection.findOne({ email: tokenEmail });

//         if (!user) {
//           return res.status(403).send({ message: 'Forbidden access' });
//         }


//         // 🔥 admin → all orders
//         if (user?.role === 'admin') {
//           const result = await ordersCollection
//             .find({})
//             .sort({ createdAt: -1 })
//             .toArray();

//           return res.send(result);
//         }

//         // 🔥 user → own orders only
//         if (!email) {
//           return res.status(403).send({ message: 'Forbidden access' });
//         }

//         if (user?.role === 'user') {
//           const result = await ordersCollection
//             .find({ customerEmail: tokenEmail })
//             .sort({ createdAt: -1 })
//             .toArray();

//           return res.send(result);
//         }
//         else {
//           return res.status(403).send({ message: 'Forbidden access' });
//         }

//       } catch (error) {
//         res.status(500).send({ message: 'Failed to fetch orders' });
//       }
//     });


//     // create order

//     app.post('/orders', verifyJwtToken, async (req, res) => {
//       try {

//         const order = req.body;

//         const newOrder = {
//           ...order,

//           status: 'pending',            // ⭐ single status field
//           paymentStatus: 'unpaid',      // ⭐ payment default

//           createdAt: new Date()
//         };

//         const result = await ordersCollection.insertOne(newOrder);

//         res.send(result);

//       } catch (error) {
//         console.error(error);
//         res.status(500).send({ message: 'Order creation failed' });
//       }
//     });


//     app.patch('/orders/:id', verifyJwtToken, async (req, res) => {
//       try {

//         const id = req.params.id;
//         const updateData = req.body;

//         const result = await ordersCollection.updateOne(
//           { _id: new ObjectId(id) },
//           { $set: updateData }
//         );

//         res.send(result);

//       } catch (error) {
//         res.status(500).send({ message: 'Order update failed' });
//       }
//     });



//     app.post('/paymentBkash', async (req, res) => {
//       const { orderId } = req.body;
//       console.log("orderId bkash", orderId)

//       try {
//         // const orederData = await oredersCollection.findOne(orderId);
//         const orderData = await ordersCollection.findOne({ _id: new ObjectId(orderId) });
//         const tran_id = orderId
//         const data = {
//           total_amount: orderData.orderTotal,
//           currency: 'BDT',
//           tran_id: tran_id, // use unique tran_id for each api call
//           success_url: `http://localhost:5000/payment/success/${tran_id}`,
//           fail_url: 'http://localhost:5000/payment/fail',
//           cancel_url: 'http://localhost:5000/payment/cancel',
//           ipn_url: 'http://localhost:5000/ipn',
//           shipping_method: 'Courier',
//           product_name: 'Computer.',
//           product_category: 'Electronic',
//           product_profile: 'general',
//           cus_name: 'Customer Name',
//           cus_email: 'customer@example.com',
//           cus_add1: 'Dhaka',
//           cus_add2: 'Dhaka',
//           cus_city: 'Dhaka',
//           cus_state: 'Dhaka',
//           cus_postcode: '1000',
//           cus_country: 'Bangladesh',
//           cus_phone: '01711111111',
//           cus_fax: '01711111111',
//           ship_name: 'Customer Name',
//           ship_add1: 'Dhaka',
//           ship_add2: 'Dhaka',
//           ship_city: 'Dhaka',
//           ship_state: 'Dhaka',
//           ship_postcode: 1000,
//           ship_country: 'Bangladesh',
//         };

//         const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
//         sslcz.init(data).then(apiResponse => {
//           // Redirect the user to payment gateway
//           let GatewayPageURL = apiResponse.GatewayPageURL
//           // res.json({ success: true, url: GatewayPageURL })
//           res.send({ success: true, url: GatewayPageURL })
//         });
//       }
//       catch (error) {
//         console.log(error)
//       }
//     })

//     app.post('/payment/success/:id', verifyJwtToken, async (req, res) => {
//       const { id } = req.params;
//       try {
//         await ordersCollection.updateOne(
//           { _id: new ObjectId(id) },
//           {
//             $set: {
//               paymentStatus: 'paid',
//               status: 'confirmed'
//             }
//           }
//         );
//         res.redirect('http://localhost:5173/my-orders' || 'https://grand-hall.web.app')
//       }
//       catch (error) {
//         console.log(error)
//       }
//     })





//     // 🔥 THEN start server
//     app.listen(port, () => {
//       console.log(`🚀 Server running on port ${port}`);
//     });

//   } catch (error) {
//     console.error('❌ Failed to start server', error);
//   }
// }

// startServer();