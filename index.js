const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5gpxm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });




async function run() {
    try{
        await client.connect();
        const productCollection = client.db('warehouse').collection('products');

        app.get('/products', async(req, res) => {
            const query = {};
            const cursor = productCollection.find(query);

            const products = await cursor.toArray();

            res.send(products);
        })
    }
    finally{
        console.log("connected");
    }
}


run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("Server is running");
})

app.listen(port, () => {
    console.log("Running Server");
})