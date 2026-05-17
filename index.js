const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@pawmart-cluster.hhcghco.mongodb.net/?appName=pawmart-cluster`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Synchronously define DB and Collections for immediate route registration under Vercel
const database = client.db("pawMartDB");
const listingsCollection = database.collection("listings");
const ordersCollection = database.collection("orders");

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
  }
}
connectDB().catch(console.dir);

// Get all listings
app.get('/listings', async (req, res) => {
    const cursor = listingsCollection.find().sort({ _id: 1 });
    const result = await cursor.toArray();
    res.send(result);
});

// Get latest 6 listings
app.get('/listings/latest', async (req, res) => {
    const cursor = listingsCollection.find().sort({ _id: -1 }).limit(6);
    const result = await cursor.toArray();
    res.send(result);
});

// Get single listing by ID
app.get('/listings/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await listingsCollection.findOne(query);
    res.send(result);
});

// Add new listing
app.post('/listings', async (req, res) => {
    const newListing = req.body;
    const result = await listingsCollection.insertOne(newListing);
    res.send(result);
});

// Get listings by user email
app.get('/listings/email/:email', async (req, res) => {
    const email = req.params.email;
    const query = { email: email };
    const cursor = listingsCollection.find(query);
    const result = await cursor.toArray();
    res.send(result);
});

// Update listing by ID
app.patch('/listings/:id', async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const updatedDoc = {
        $set: {
            name: req.body.name,
            category: req.body.category,
            price: Number(req.body.price),
            location: req.body.location,
            description: req.body.description,
            image: req.body.image,
            date: req.body.date
        }
    };
    const result = await listingsCollection.updateOne(filter, updatedDoc);
    res.send(result);
});

// Delete listing by ID
app.delete('/listings/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await listingsCollection.deleteOne(query);
    res.send(result);
});

// New order / Adoption request
app.post('/orders', async (req, res) => {
    const newOrder = req.body;
    const result = await ordersCollection.insertOne(newOrder);
    res.send(result);
});

// Get orders by user email
app.get('/orders/email/:email', async (req, res) => {
    const email = req.params.email;
    const query = { buyerEmail: email };
    const cursor = ordersCollection.find(query);
    const result = await cursor.toArray();
    res.send(result);
});

// Root route
app.get('/', (req, res) => {
    res.send('PawMart server is running');
});

app.listen(port, () => {
    console.log(`PawMart Server is running on port: http://localhost:${port}/`);
});

module.exports = app;
