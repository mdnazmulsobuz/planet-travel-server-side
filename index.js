const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jo3sa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
 
async function run (){
    try{
        await client.connect();
        const database = client.db('travel_booking');
        const packagesCollection = database.collection('packages');
        const ordersCollection = database.collection('orders');

        // Get pacakges api
        app.get('/packages', async(req, res)=>{
            const cursor = packagesCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages);
        });

        // get single package 
        app.get('/packages/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const package = await packagesCollection.findOne(query);
            res.json(package);
        });

        // post api
        app.post('/packages', async(req,res)=>{
            const package = req.body;
            const result = await packagesCollection.insertOne(package);
            res.json(result);
        });

        //  Get orders api
        app.get('/orders', async(req, res)=>{
            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        });

        // add order api
        app.post('/orders', async(req,res)=>{
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.json(result);
        });

        // delete order api
        app.delete('/orders/:id', async (req, res) =>{
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            res.json(result);
        } );

       // get single package 
       app.get('/orders/:', async(req, res) =>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const package = await packagesCollection.findOne(query);
        res.json(package);
    });
      

    // my order api 
        app.get('/orders/:email', async (req, res) =>{
        const result = await ordersCollection.find({email: req.params.email}).toArray();
        res.send(result);
    });

  
    }
    finally{
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) =>{
    res.send('Planet Travel Server is running');
});
app.get('/hello', (req, res) =>{
    res.send('Hello heorku');
});

app.listen(port, ()=>{
    console.log('Server running at port', port);
});