const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, MongoRuntimeError, ObjectId } = require('mongodb');

const app = express()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rqkhp.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect()
        console.log("Connect")
        const tasksCollection = client.db('task_1').collection('Given_Tasks')
        app.get('/task', async (req, res) => {


            const query = {}
            const purchases = await tasksCollection.find(query).toArray();
            return res.send(purchases);



        })
        app.post('/task', async (req, res) => {
            const purchase = req.body

            const result = await tasksCollection.insertOne(purchase);
            return res.send(result);
        })
        app.put('/task/:id', async (req, res) => {
            console.log(req.params)
            const id = req.params.id;
            const data = req.body.date;
            const query = {
                _id: ObjectId(id)

            }
            const options = { upsert: true };
            // create a document that sets the plot of the movie
            const updateDoc = {
                $set: {
                    task: data
                },
            };
            const result = await tasksCollection.updateOne(query, updateDoc, options)
            res.send(result)
        })

    }
    finally { }

}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
