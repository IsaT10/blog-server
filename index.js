const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//blogDb  g5ozt8dTGWj31h76

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kfd97zi.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const blogsCollection = client.db('blogDB').collection('blogs');

async function run() {
  try {
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('blog server is running');
});

app.get('/api/blogs', async (req, res) => {
  const result = await blogsCollection.find().toArray();
  res.send(result);
});

app.get('/api/blogs/category/:categoryName', async (req, res) => {
  const { categoryName } = req.params;
  const query = { category: categoryName };
  //   console.log(category);
  const result = await blogsCollection.find(query).toArray();
  res.send(result);
});

app.get('/api/blogs/:id', async (req, res) => {
  const { id } = req.params;
  const query = { _id: new ObjectId(id) };
  const result = await blogsCollection.findOne(query);
  res.send(result);
});

app.post('/api/blogs', async (req, res) => {
  const data = req.body;
  const result = await blogsCollection.insertOne(data);
  res.send(result);
});

app.listen(port, () => {
  console.log(`blog server is running :${port}`);
});
