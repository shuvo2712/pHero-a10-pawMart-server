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

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    app.get('/', (req, res) => {
        res.send('PawMart server is running');
    })

  } catch (error) {
    console.error("MongoDB Connection Error:", error);
  }
  // finally {
  //   await client.close();
  // }

}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`PawMart Server is running on port: http://localhost:${port}`);
})
