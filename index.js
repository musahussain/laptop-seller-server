const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

        // get products 
        app.get('/products', async(req, res) => {
            const query = {};
            const cursor = productCollection.find(query);

            const products = await cursor.toArray();

            res.send(products);
        });

        // get product by id 
        app.get('/product/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const product = await productCollection.findOne(query);
            res.send(product);
        });

        // update products quantity 
        app.put('/inventory/:id', async(req, res) => {
            const id = req.params.id;
            const updatedQuantity = req.body;
            const filter = {_id: ObjectId(id)};
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    quantity: updatedQuantity.quantity,
                }
            };
            const result = await productCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });

        // delete a user
        app.delete('/product/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await productCollection.deleteOne(query);
            res.send(result);
        })
    }
    finally{
        console.log("connected");
    }
}


run().catch(console.dir);

// root api 
app.get('/', (req, res) => {
    res.send("Server is running");
})

app.listen(port, () => {
    console.log("Running Server");
})