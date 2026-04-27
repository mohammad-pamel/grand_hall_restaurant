////////////////////////////////////////
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');
// const bkashRouter = require('./bkashRoutes'); // যদি bkashRoutes.js same folder e থাকে
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const SSLCommerzPayment = require('sslcommerz-lts')
const port = process.env.PORT || 5000;

const store_id = process.env.STORE_ID
const store_passwd = process.env.STORE_PASS
const is_live = false //true for live, false for sandbox


// var admin = require("firebase-admin");

// var serviceAccount = require("./grand-hall-firebase-adminsdk-fbsvc-86f4e9f4fc.json");

const decoded = Buffer.from(process.env.FB_SERVICE_KEY, "base64").toString("utf8");
const serviceAccount = JSON.parse(decoded);

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });


// middleware
app.use(express.json());
app.use(cors(
  // {
  // origin: 'http://localhost:5173',
  // credentials: true
// }
));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zyhkinn.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// const verifyFirebaseToken = async (req, res, next) => {
//   console.log('inside the api middleware', req.headers);

//   const authorization = req.headers.authorization;
//   console.log("Authorization:", req.headers.authorization);

//   if(!authorization){
//     return res.status(401).send({meessage: 'unauthorized access'})
//   }

//   const token = authorization.split(' ')[1];
//   if(!token){
//     return res.status(401).send({message: 'unauthorized access'})
//   }

//   try{
//     const decoded = await admin.auth().verifyIdToken(token);
//     console.log('after decoded token', decoded);
//     req.token_email = decoded.email;

//     next();
//   }
//   catch{
//     return res.status(401).send({message: 'unauthorized access'})
//   }

// }
// const verifyFirebaseToken = async (req, res, next) => {
//   const authorization = req.headers.authorization;

//   if (!authorization) {
//     return res.status(401).send({ message: "unauthorized access" });
//   }

//   const token = authorization.split(" ")[1];

//   try {
//     const decoded = await admin.auth().verifyIdToken(token);
//     console.log("Decoded Token:", decoded.email);

//     req.token_email = decoded.email;
//     next();
//   } catch (error) {
//     console.log("TOKEN VERIFY ERROR:", error.message);
//     return res.status(403).send({ message: "forbidden access" });
//   }
// };


const verifyJWTToken = async (req, res, next) => {
  console.log('in the middleware', req.headers);

  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).send({ message: "unauthorized access" });
  }

  const token = authorization.split(" ")[1];

    if(!token){
    return res.status(401).send({message: 'unauthorized access'})
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if(err){
      return res.status(401).send({message: 'unauthorized access'})
    }
    console.log('after decoded', decoded)
    req.token_email = decoded.email;
    next();

  })

  const verifyAdmin = async (req, res, next) => {

  const email = req.token_email;

  const user = await usersCollection.findOne({ email });

  if (!user || user.role !== 'admin') {
    return res.status(403).send({ message: 'Forbidden access' });
  }

  next();
};



  // try {
  //   const decoded = await admin.auth().verifyIdToken(token);
  //   console.log("Decoded Token:", decoded.email);

  //   req.token_email = decoded.email;
  //   next();
  // } catch (error) {
  //   console.log("TOKEN VERIFY ERROR:", error.message);
  //   return res.status(403).send({ message: "forbidden access" });
  // }
};




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

    // jwt related api
    app.post('/getToken', (req, res) => {
      const loggedUser = req.body;
      const token = jwt.sign(loggedUser, process.env.JWT_SECRET, {expiresIn: '1h'})
      res.send({ token: token })
    })

    
    console.log('✅ MongoDB connected');

    // ===== ROUTES =====

    app.get('/', (req, res) => {
      res.send('Grand Hall Server Running 🚀');
    });

    // ----- Bkash routes -----
    // bkashRouter.setCollections({ ordersCollection });
    // app.use('/', bkashRouter);

     // users api
    app.get('/users', async (req, res) => {
      const cursor = usersCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/users/:email/role', async (req, res) => {
  const email = req.params.email;

  const user = await usersCollection.findOne({ email });

  res.send({ role: user?.role || 'user' });
});



    app.get('/users/:id', async (req, res) => {
      const id = req.params.id;
      const result = await usersCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
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

    // app.patch('/users/:email', async (req, res) => {
    //   const email = req.params.email;
    //   const updatedInfo = req.body;

    //   const query = { email };
    //   const updateDoc = {
    //     $set: updatedInfo
    //   };

    //   const result = await usersCollection.updateOne(query, updateDoc);
    //   res.send(result);
    // });


    app.patch('/users/:id', async (req, res) => {
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


    app.post('/menu', async (req, res) => {
      try {
        const food = req.body;
        const result = await foodsCollection.insertOne(food);
        res.send(result);
      } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Insert failed' });
      }
    });

    app.patch('/menu/:id', async (req, res) => {
  const id = req.params.id;
  const updatedFood = req.body;

  const result = await foodsCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: updatedFood }
  );

  res.send(result);
});

app.delete('/menu/:id', async (req, res) => {
  const id = req.params.id;
  const result = await foodsCollection.deleteOne({
    _id: new ObjectId(id)
  });
  res.send(result);
});


//////////////// CART////////////////////////////////////

app.get("/cart", async(req,res)=>{

 const email = req.query.email

 const result = await cartCollection
 .find({email})
 .toArray()

 res.send(result)

})

app.post("/cart", async(req,res)=>{

 const cartItem = req.body

 const query = {
   foodId: cartItem.foodId,
   email: cartItem.email
 }

 const existing = await cartCollection.findOne(query)

 if(existing){
   return res.send({message:"already added"})
 }

 const result = await cartCollection.insertOne(cartItem)

 res.send(result)

})

app.patch("/cart/increase/:id", async (req, res) => {

 const id = req.params.id;

 const result = await cartCollection.updateOne(
  { _id: new ObjectId(id) },
  { $inc: { quantity: 1 } }
 );

 res.send(result);
});

app.patch("/cart/decrease/:id", async (req, res) => {

 const id = req.params.id;

 const result = await cartCollection.updateOne(
  { _id: new ObjectId(id) },
  { $inc: { quantity: -1 } }
 );

 res.send(result);
});

app.delete("/cart/:id", async (req, res) => {

 const id = req.params.id;

 const result = await cartCollection.deleteOne({
  _id: new ObjectId(id)
 });

 res.send(result);

});


app.delete("/cart/user/:email", async(req,res)=>{

 const email = req.params.email

 const result = await cartCollection.deleteMany({email})

 res.send(result)

})


app.get('/orders', verifyJWTToken, async (req, res) => {

  try {

    const email = req.query.email;

    // 🔥 যদি admin হয় → সব order দেখবে
    const user = await usersCollection.findOne({ email: req.token_email });

    if (user?.role === 'admin') {

      const result = await ordersCollection
        .find({})
        .sort({ createdAt: -1 })
        .toArray();

      return res.send(result);
    }

    // 🔥 যদি normal user হয় → শুধু নিজের order
    if (email !== req.token_email) {
      return res.status(403).send({ message: 'Forbidden access' });
    }

    const result = await ordersCollection
      .find({ customerEmail: email })
      .sort({ createdAt: -1 })
      .toArray();

    res.send(result);

  } catch (error) {

    console.log(error);
    res.status(500).send({ message: 'Failed to fetch orders' });

  }
});

// create order


app.post('/orders', async (req, res) => {
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


app.patch('/orders/:id', async (req, res) => {
  try {

    const id = req.params.id;
    const updateData = req.body;

    const result = await ordersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    res.send(result);

  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Order update failed' });
  }
});


/////////Payment  Bkash

// const paymentBkash = async (req, res) => {
//   const {orderId} = req.body;
//   console.log(orderId);
// }

app.post('/paymentBkash', async (req, res) => {
  const {orderId} = req.body;
  console.log(orderId);

  try {
    // const orederData = await oredersCollection.findOne(orderId);
    const orderData = await ordersCollection.findOne({ _id: new ObjectId(orderId) });
    console.log(orderData);
    const tran_id = orderId
     const data = {
        total_amount: orderData.orderTotal,
        currency: 'BDT',
        tran_id: tran_id, // use unique tran_id for each api call
        success_url: `http://localhost:5000/payment/success/${tran_id}`,
        fail_url: 'http://localhost:5000/payment/fail',
        cancel_url: 'http://localhost:5000/payment/cancel',
        ipn_url: 'http://localhost:5000/ipn',
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
    console.log(data);
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
    sslcz.init(data).then(apiResponse => {
        // Redirect the user to payment gateway
        let GatewayPageURL = apiResponse.GatewayPageURL
        res.json({success: true, url: GatewayPageURL})
        console.log('Redirecting to: ', GatewayPageURL)
    });
  }
  catch {

  }
})

app.post('/paymentSuccess/:id', async (req, res) => {
  const {tranId} = req.params;
  try {
    await ordersCollection.findOne(tranId, {
      paymentStatus: paid,
    })
    res.redirect('http://localhost:5173/my-orders')
  }
  catch(error){

  }
})





    // 🔥 THEN start server
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });

  } catch (error) {
    console.error('❌ Failed to start server', error);
  }
}

startServer();