const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');

const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jo3sa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
 
console.log(uri);

async function run (){
    try{
        await client.connect();
        const database = client.db('travel_booking');
        const packagesCollection = database.collection('packages')

        // post api
        app.post('/packages', async(req,res)=>{
            const package = req.body;
            const result = await packagesCollection.insertOne(package);
            res.json(result);
        })
        

        // Get pacakges api
        app.get('/packages', async(req, res)=>{
            const cursor = packagesCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages);
        })
    }
    finally{
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) =>{
    res.send('Planet Travel Server is running');
});

app.listen(port, ()=>{
    console.log('Server running at port', port);
});