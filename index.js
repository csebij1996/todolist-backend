import express from 'express';
import fs from 'fs';
import cors from 'cors';
import { ObjectId } from 'mongodb';
import {MongoClient, ServerApiVersion} from 'mongodb';
const app = express();

app.use(express.json());
app.use(cors());

function mongoServer() { 
    const uri = "mongodb+srv://csebij1996:ZXgtd5Yajani1129@cluster0.9qhg5x8.mongodb.net/?retryWrites=true&w=majority";
    // Create a MongoClient with a MongoClientOptions object to set the Stable API version
    return new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
    });
}

function getId(raw) {
    try {
        return new ObjectId(raw)
    } catch (error) {
        return false
    }
}


app.get('/api/tasks', (req, res) => {

    const client = mongoServer();
    async function run() {
        try {
          await client.connect();
          const tasks = await client.db("todo_app").collection("tasks").find().toArray();
          res.status(200).send(tasks);
        } finally {
          await client.close();
        }
      }
      run().catch(console.dir);
    
})

app.post('/api/create-task', (req, res) => {

    const newTask = {
        task: req.body.task
    }

    const client = mongoServer();
    async function run() {
        try {
          await client.connect();
          const tasks = await client.db("todo_app").collection("tasks").insertOne(newTask);
          if(!tasks.insertedId) {
            res.send('insert error')
            return;
          }
          res.status(200).json({msg: 'success'})
        } finally {
          await client.close();
        }
      }
      run().catch(console.dir);

})

app.delete('/api/task/:id', (req, res) => {

    const id = getId(req.params.id);
    if(!id) return res.status(401).json({msg: 'invalid id'})

    const client = mongoServer();
    async function run() {
        try {
          await client.connect();
          const tasks = await client.db("todo_app").collection("tasks").deleteOne({_id: id});
          if(!tasks.deletedCount) {
            res.send({msg: 'id not found'})
            return;
          }
          res.status(200).json({msg: 'success'})
        } finally {
          await client.close();
        }
      }
      run().catch(console.dir);

})


app.listen(4000, () => {
    console.log('sikeres csatlakozás!');
});

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    .replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, 
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}