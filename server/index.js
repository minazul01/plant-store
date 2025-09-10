require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const jwt = require('jsonwebtoken')
const morgan = require('morgan')

const port = process.env.PORT || 9000
const app = express()
// middleware
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  optionSuccessStatus: 200,
}
app.use(cors(corsOptions))

app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))

const verifyToken = async (req, res, next) => {
  const token = req.cookies?.token

  if (!token) {
    return res.status(401).send({ message: 'unauthorized access' })
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log(err)
      return res.status(401).send({ message: 'unauthorized access' })
    }
    req.user = decoded
    next()
  })
}

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.eyk5ydv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})
async function run() {
  try {
    
    // collections name
    const userCollection = client.db('plantNetDB').collection('users')
    const plantCollection = client.db('plantNetDB').collection('plants')
    const orderCollection = client.db('plantNetDB').collection('orders')


    // all user data collection
    app.post('/users/:email', async (req, res) => {
      const email = req.params.email
      const query = {email}
      const user = req.body
      // if user exits in db collection
      const isExist = await userCollection.findOne(query)
      if(isExist) {
        return res.send(isExist)
      }
      const result = await userCollection.insertOne({
        ...user,
        role: 'customer',
        timestamp: Date.now(),
      })
      res.send(result)
    })


    // user role
    app.get('/user-role/:email', async (req, res) => {
      const email = req.params.email;
      const query = {email}
      const result  = await userCollection.findOne(query);
      res.send(result?.role)
    })


    // pacific user request at seller
    app.patch('/user-request/:email', verifyToken, async (req, res) => {
      const email = req.params.email;
      const query = {email};
      const user = await userCollection.findOne(query);
      if(!user || user?.status === 'Requested') return res.status(400).send('requested already approved!!');
      const updateDock = {
        $set: {
          status: 'Requested'
        }
      }
      const result = await userCollection.updateOne(query, updateDock);
      res.send(result);
    });


    // Generate jwt token
    app.post('/jwt', async (req, res) => {
      const email = req.body
      const token = jwt.sign(email, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '365d',
      })
      res
        .cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })
        .send({ success: true })
    })
    // Logout
    app.get('/logout', async (req, res) => {
      try {
        res
          .clearCookie('token', {
            maxAge: 0,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
          })
          .send({ success: true })
      } catch (err) {
        res.status(500).send(err)
      }
    })

    // save a planets in db
    app.post('/plants', async (req, res) => {
      const data = req.body;
      const result = await plantCollection.insertOne(data)
      res.send(result)
    })

    // save planets ui client side
    app.get('/plants', async (req, res) => {
      const result = await plantCollection.find().toArray()
      res.send(result)
    })

    // details plant by dynamic id
    app.get('/plants/:id', async (req, res ) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await plantCollection.findOne(query);
      res.send(result);
    });

    // order purchase in db
    app.post('/orders', verifyToken, async (req, res) => {
      const orderInfo = req.body;
      const result = await orderCollection.insertOne(orderInfo);
      res.send(result);
    });



    // manage quantity plant
    app.patch('/plant-quantity/:id', verifyToken, async (req, res) => {
      const id = req.params.id;
      const {quantityUpdate, status} = req.body;
      const filter = {_id: new ObjectId(id)};
      let updateDock = {
        $inc: {
          quantity: - quantityUpdate,
        }
      }
      if(status === 'increase'){
        updateDock = {
        $inc: {
          quantity: quantityUpdate,
        }
      }
      }
      const result = await plantCollection.updateOne(filter, updateDock);
      res.send(result);
    });

    // pacific order filter by email data ui show in client
    app.get('/customer-plant/:email',verifyToken, async (req, res) => {
      const email = req.params.email;
      const query = {'customer.email': email};
      const result = await orderCollection.aggregate([
        {
          $match: query,          // match the email to db
        },
        {
          $addFields: {           //plant id will just id so we will just id to convert object id
             plantId: {$toObjectId: '$plantId'},
          }
        },
        {
          $lookup: {             //collection match and before id and now id match to return plants
            from: 'plants',
            localField: 'plantId',
            foreignField: '_id',
            as: 'plants'
          }
        },
        {$unwind: '$plants'},         //plant array to object convert
        {
          $addFields: {              //plant object to pacific data get
            name: '$plants.name',
            image: '$plants.image',
            category: '$plants.category',
          }
        },
        {
          $project: {             //I will plants object block or remove 
            plants: 0,
          }
        }
      ]).toArray();
      res.send(result);
    });

    // order plants delete or cancel
    app.delete('/order-delete/:id', verifyToken, async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const order = await orderCollection.findOne(query);
      if(order.status === 'delivered'){
          return res.status(904).send('The order can not cancel !!');
      }
      const result = await orderCollection.deleteOne(query);
      res.send(result);
    });





    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 })
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    )
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Hello from plantNet Server..')
})

app.listen(port, () => {
  console.log(`plantNet is running on port ${port}`)
})
