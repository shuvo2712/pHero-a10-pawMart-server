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

async function run() {
  try {
    // Connect the client to the server
    await client.connect();

    const database = client.db("pawMartDB");
    const listingsCollection = database.collection("listings");

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

    // Root route
    app.get('/', (req, res) => {
        res.send('PawMart server is running');
    })

    console.log("Connected to MongoDB successfully!");

  } catch (error) {
    console.error("MongoDB Connection Error:", error);
  }
  // finally {
  //   await client.close();
  // }

}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`PawMart Server is running on port:        http://localhost:${port}/`);
})
